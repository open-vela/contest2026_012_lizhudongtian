/**
 * 本地游戏引擎 —— P0 单机版「一块表轮流看」的权威状态源。
 *
 * 设计与服务端状态机同构(见 docs/tech-design.md 第八节),
 * 便于 P1 把这层替换成 fetch 轮询而页面几乎不改:
 *   状态: waiting -> dealing -> describe -> vote -> reveal -> (describe|finished)
 *
 * 单机模式下所有玩家共用一块表,身份靠「传表私密查看」保证不剧透,
 * 因此引擎在内存里持有全部身份,由 deal 页控制何时展示给谁。
 *
 * 模块单例:状态存在模块作用域,跨页面导航保持。
 */

import { drawPair } from './words.js'

/**
 * 状态挂到 global —— 快应用每个页面是独立 bundle,模块级变量不跨页面共享,
 * 必须用 global 作为跨页面的唯一状态源(见 vela-js-app 知识库「公共方法挂 global」)。
 */
function defaultState() {
  return {
    status: 'idle',      // idle|dealing|describe|vote|reveal|finished
    round: 0,
    playerCount: 0,
    difficulty: 1,
    players: [],         // [{ id, name, role, word, alive }]
    wordPair: null,      // { civilian, undercover }
    speakingOrder: [],   // player id 顺序
    votes: {},           // { voterId: targetId }
    lastOut: null,       // 上一轮出局者 id
    lastWinner: null     // 'civilian' | 'undercover' | null
  }
}

if (!global.__undercoverState) {
  global.__undercoverState = defaultState()
}
const state = global.__undercoverState

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const t = a[i]
    a[i] = a[j]
    a[j] = t
  }
  return a
}

/** 卧底人数规则:<=5 人 1 个,>5 人 2 个 */
function undercoverCountFor(n) {
  return n > 5 ? 2 : 1
}

/**
 * 开新局:分配身份词、生成发言顺序,进入发牌阶段。
 * @param {number} playerCount 4-8
 * @param {number} difficulty  0|1|2
 * @param {string[]} [names]   可选玩家名,不足则用「玩家N」
 */
function newGame(playerCount, difficulty, names) {
  const pair = drawPair(difficulty)
  const ids = []
  for (let i = 0; i < playerCount; i++) ids.push('P' + (i + 1))

  const undercovers = new Set(shuffle(ids).slice(0, undercoverCountFor(playerCount)))
  const players = ids.map((id, i) => {
    const role = undercovers.has(id) ? 'undercover' : 'civilian'
    return {
      id: id,
      name: (names && names[i]) || ('玩家' + (i + 1)),
      role: role,
      word: role === 'undercover' ? pair.undercover : pair.civilian,
      alive: true
    }
  })

  state.status = 'dealing'
  state.round = 1
  state.playerCount = playerCount
  state.difficulty = difficulty
  state.players = players
  state.wordPair = pair
  state.speakingOrder = shuffle(ids)
  state.votes = {}
  state.lastOut = null
  state.lastWinner = null
}

/** 发牌完成,进入首轮描述 */
function startPlaying() {
  state.status = 'describe'
}

/** 存活玩家(按发言顺序) */
function aliveInOrder() {
  return state.speakingOrder
    .map((id) => state.players.find((p) => p.id === id))
    .filter((p) => p && p.alive)
}

function getPlayer(id) {
  return state.players.find((p) => p.id === id)
}

/** 描述 -> 投票 */
function toVoting() {
  if (state.status !== 'describe') return
  state.status = 'vote'
  state.votes = {}
}

/** 记录一票(投票阶段) */
function castVote(voterId, targetId) {
  if (state.status !== 'vote') return
  const voter = getPlayer(voterId)
  if (!voter || !voter.alive) return
  state.votes[voterId] = targetId
}

/** 是否所有存活玩家都已投票 */
function allVoted() {
  const aliveIds = state.players.filter((p) => p.alive).map((p) => p.id)
  return aliveIds.every((id) => state.votes[id] != null)
}

/** 统计票数最高者;平票返回 null(本轮无人出局) */
function tallyOut() {
  const count = {}
  Object.keys(state.votes).forEach((voter) => {
    const t = state.votes[voter]
    count[t] = (count[t] || 0) + 1
  })
  let max = -1
  let out = null
  let tie = false
  Object.keys(count).forEach((id) => {
    if (count[id] > max) {
      max = count[id]
      out = id
      tie = false
    } else if (count[id] === max) {
      tie = true
    }
  })
  return tie ? null : out
}

/** 胜负判定 */
function judge() {
  const alive = state.players.filter((p) => p.alive)
  const aliveUnder = alive.filter((p) => p.role === 'undercover')
  const aliveCivil = alive.filter((p) => p.role === 'civilian')
  if (aliveUnder.length === 0) return 'civilian'
  if (aliveUnder.length >= aliveCivil.length) return 'undercover'
  return null
}

/** 投票 -> 公布(出局 + 判定) */
function toReveal() {
  if (state.status !== 'vote') return
  const out = tallyOut()
  if (out) {
    const p = getPlayer(out)
    if (p) p.alive = false
  }
  state.lastOut = out
  state.lastWinner = judge()
  state.status = state.lastWinner ? 'finished' : 'reveal'
}

/** 公布 -> 下一轮描述 */
function nextRound() {
  if (state.status !== 'reveal') return
  state.round += 1
  state.status = 'describe'
  state.votes = {}
  state.lastOut = null
}

function getState() {
  return state
}

function reset() {
  state.status = 'idle'
  state.round = 0
  state.players = []
  state.wordPair = null
  state.speakingOrder = []
  state.votes = {}
  state.lastOut = null
  state.lastWinner = null
}

export default {
  newGame,
  startPlaying,
  aliveInOrder,
  getPlayer,
  toVoting,
  castVote,
  allVoted,
  toReveal,
  nextRound,
  getState,
  reset
}
