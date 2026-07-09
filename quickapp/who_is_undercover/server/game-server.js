'use strict'

/**
 * 《谁是卧底》最小游戏服务端 —— 第 0 周连通性验证 + P1 底座
 *
 * 零第三方依赖,仅用 Node 内置模块。实现 docs/tech-design.md 第七节协议:
 *   POST /room                      创建房间   -> { roomId, playerId }
 *   POST /room/{roomId}/join        加入房间   -> { playerId }
 *   POST /room/{roomId}/start       房主开局
 *   POST /room/{roomId}/vote        投票
 *   POST /room/{roomId}/next        房主推进阶段
 *   GET  /room/{roomId}/state?playerId=X&since=N   轮询本视角快照(按 playerId 裁剪)
 *   GET  /health                    健康探针 -> { ok: true }
 *
 * 权威状态全在服务端;响应按 playerId 裁剪,yourWord 只发给本人。
 *
 * 启动:
 *   node server/game-server.js            # HTTPS(默认,需 certs/,见 gen-cert.sh)
 *   PROTO=http node server/game-server.js # 明文 HTTP(仅本地 curl 调试用)
 */

const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = Number(process.env.PORT || 8443)
const PROTO = (process.env.PROTO || 'https').toLowerCase()
const CERT_DIR = path.join(__dirname, 'certs')

// ---- 内置词库(AI 出题失败时的兜底,见 tech-design 第十节)----
const WORD_PAIRS = [
  { civilian: '咖啡', undercover: '奶茶' },
  { civilian: '老虎', undercover: '狮子' },
  { civilian: '包子', undercover: '饺子' },
  { civilian: '西瓜', undercover: '冬瓜' },
  { civilian: '钢琴', undercover: '电子琴' },
  { civilian: '篮球', undercover: '排球' }
]

// ---- 内存房间表 ----
/** @type {Map<string, Room>} */
const rooms = new Map()

let playerSeq = 0
function newPlayerId() {
  playerSeq += 1
  return 'p_' + playerSeq
}
function newRoomId() {
  // 4 位数字房号,避免碰撞则重试
  for (let i = 0; i < 50; i++) {
    const id = String(1000 + Math.floor(Math.random() * 9000))
    if (!rooms.has(id)) return id
  }
  return String(Date.now()).slice(-4)
}

/**
 * @typedef {Object} Room
 * @property {string} roomId
 * @property {string} status      waiting|playing|voting|revealed|finished
 * @property {string} phase       describe|vote|reveal
 * @property {string} hostId
 * @property {number} round
 * @property {number} version
 * @property {Array}  players      [{id,name,alive}]
 * @property {Object} wordPair     {civilian,undercover}   服务端私有,绝不下发
 * @property {Object} assignments  {playerId: 'civilian'|'undercover'}  私有
 * @property {Object} votes        {voterId: targetId}
 * @property {string[]} speakingOrder
 * @property {Object} timer        {endsAt, seconds} | null
 */

function createRoom(hostName) {
  const roomId = newRoomId()
  const hostId = newPlayerId()
  /** @type {Room} */
  const room = {
    roomId,
    status: 'waiting',
    phase: 'describe',
    hostId,
    round: 0,
    version: 1,
    players: [{ id: hostId, name: hostName || '主持人', alive: true }],
    wordPair: null,
    assignments: {},
    votes: {},
    speakingOrder: [],
    timer: null
  }
  rooms.set(roomId, room)
  return { room, playerId: hostId }
}

function bumpVersion(room) {
  room.version += 1
}

function assignRolesAndWords(room) {
  const pair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)]
  room.wordPair = pair
  const ids = room.players.map(p => p.id)
  // 简单规则:人数 <=5 时 1 卧底,>5 时 2 卧底
  const undercoverCount = ids.length > 5 ? 2 : 1
  const shuffled = ids.slice().sort(() => Math.random() - 0.5)
  const undercovers = new Set(shuffled.slice(0, undercoverCount))
  room.assignments = {}
  ids.forEach(id => {
    room.assignments[id] = undercovers.has(id) ? 'undercover' : 'civilian'
  })
  room.speakingOrder = ids.slice().sort(() => Math.random() - 0.5)
}

function judge(room) {
  const alive = room.players.filter(p => p.alive)
  const aliveUnder = alive.filter(p => room.assignments[p.id] === 'undercover')
  const aliveCivil = alive.filter(p => room.assignments[p.id] === 'civilian')
  if (aliveUnder.length === 0) return 'civilian' // 卧底全出局,平民胜
  if (aliveUnder.length >= aliveCivil.length) return 'undercover' // 卧底人数 >= 平民,卧底胜
  return null
}

/** 统计当前 votes 中票数最高者(平票返回 null 表示无人出局) */
function tallyOut(room) {
  const count = {}
  Object.values(room.votes).forEach(t => {
    count[t] = (count[t] || 0) + 1
  })
  let max = -1
  let out = null
  let tie = false
  Object.keys(count).forEach(id => {
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

/**
 * 按 playerId 裁剪出本视角快照 —— 防剧透的核心。
 * wordPair / assignments 永不下发;yourWord 只给本人;
 * votes 仅在 revealed 阶段公开。
 */
function viewFor(room, playerId) {
  const view = {
    roomId: room.roomId,
    version: room.version,
    status: room.status,
    phase: room.phase,
    round: room.round,
    hostId: room.hostId,
    players: room.players.map(p => ({ id: p.id, name: p.name, alive: p.alive })),
    speakingOrder: room.speakingOrder,
    timer: room.timer,
    yourWord: null,
    yourRole: null,
    voteResult: null
  }
  const role = room.assignments[playerId]
  if (role && room.wordPair) {
    view.yourWord = role === 'undercover' ? room.wordPair.undercover : room.wordPair.civilian
    view.yourRole = role
  }
  if (room.status === 'revealed' || room.status === 'finished') {
    view.voteResult = {
      votes: room.votes,
      out: room._lastOut || null,
      winner: room._lastWinner || null
    }
  }
  return view
}

// ---- 动作处理 ----
function handleAction(room, action, body) {
  const playerId = body.playerId
  switch (action) {
    case 'join': {
      const id = newPlayerId()
      room.players.push({ id, name: body.name || ('玩家' + room.players.length), alive: true })
      bumpVersion(room)
      return { playerId: id }
    }
    case 'start': {
      if (playerId !== room.hostId) return { error: 'only host can start', code: 403 }
      if (room.players.length < 3) return { error: 'need at least 3 players', code: 400 }
      assignRolesAndWords(room)
      room.round = 1
      room.status = 'playing'
      room.phase = 'describe'
      room.votes = {}
      room.timer = { endsAt: Date.now() + 30000, seconds: 30 }
      bumpVersion(room)
      return { ok: true }
    }
    case 'vote': {
      if (room.status !== 'voting') return { error: 'not in voting phase', code: 400 }
      const voter = room.players.find(p => p.id === playerId && p.alive)
      if (!voter) return { error: 'invalid voter', code: 400 }
      room.votes[playerId] = body.targetId
      bumpVersion(room)
      return { ok: true }
    }
    case 'next': {
      if (playerId !== room.hostId) return { error: 'only host can advance', code: 403 }
      advancePhase(room)
      bumpVersion(room)
      return { ok: true }
    }
    default:
      return { error: 'unknown action', code: 404 }
  }
}

function advancePhase(room) {
  if (room.status === 'playing') {
    // 描述 -> 投票
    room.status = 'voting'
    room.phase = 'vote'
    room.votes = {}
    room.timer = { endsAt: Date.now() + 30000, seconds: 30 }
    return
  }
  if (room.status === 'voting') {
    // 投票 -> 公布
    const out = tallyOut(room)
    if (out) {
      const p = room.players.find(x => x.id === out)
      if (p) p.alive = false
    }
    room._lastOut = out
    const winner = judge(room)
    room._lastWinner = winner
    room.status = winner ? 'finished' : 'revealed'
    room.phase = 'reveal'
    room.timer = null
    return
  }
  if (room.status === 'revealed') {
    // 公布 -> 下一轮描述
    room.round += 1
    room.status = 'playing'
    room.phase = 'describe'
    room.votes = {}
    room.timer = { endsAt: Date.now() + 30000, seconds: 30 }
    return
  }
}

// ---- HTTP 路由 ----
function sendJson(res, code, obj) {
  const data = JSON.stringify(obj)
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  })
  res.end(data)
}

function readBody(req) {
  return new Promise((resolve) => {
    let buf = ''
    req.on('data', c => { buf += c; if (buf.length > 1e6) req.destroy() })
    req.on('end', () => {
      if (!buf) return resolve({})
      try { resolve(JSON.parse(buf)) } catch (e) { resolve({}) }
    })
  })
}

async function handler(req, res) {
  const method = req.method
  if (method === 'OPTIONS') return sendJson(res, 204, {})

  const u = new URL(req.url, 'http://x')
  const parts = u.pathname.split('/').filter(Boolean) // ['room','8421','state']

  // GET /health
  if (method === 'GET' && parts[0] === 'health') {
    return sendJson(res, 200, { ok: true, ts: Date.now(), rooms: rooms.size })
  }

  // POST /room  创建
  if (method === 'POST' && parts.length === 1 && parts[0] === 'room') {
    const body = await readBody(req)
    const { room, playerId } = createRoom(body.name)
    return sendJson(res, 200, { roomId: room.roomId, playerId })
  }

  // /room/{roomId}/...
  if (parts[0] === 'room' && parts[1]) {
    const room = rooms.get(parts[1])
    if (!room) return sendJson(res, 404, { error: 'room not found' })
    const sub = parts[2]

    if (method === 'GET' && sub === 'state') {
      const playerId = u.searchParams.get('playerId')
      const since = Number(u.searchParams.get('since') || 0)
      // since 与当前版本一致 -> 无变更(客户端可保留上一帧,减少渲染)
      if (since && since === room.version) {
        return sendJson(res, 200, { version: room.version, unchanged: true })
      }
      return sendJson(res, 200, viewFor(room, playerId))
    }

    if (method === 'POST' && ['join', 'start', 'vote', 'next'].includes(sub)) {
      const body = await readBody(req)
      const result = handleAction(room, sub, body)
      if (result.error) return sendJson(res, result.code || 400, { error: result.error })
      return sendJson(res, 200, result)
    }
  }

  return sendJson(res, 404, { error: 'not found', path: u.pathname })
}

// ---- 启动 ----
function start() {
  if (PROTO === 'http') {
    http.createServer(handler).listen(PORT, () => {
      console.log(`[game-server] HTTP  listening on http://0.0.0.0:${PORT}  (仅本地调试)`)
    })
    return
  }
  const https = require('https')
  let opts
  try {
    opts = {
      key: fs.readFileSync(path.join(CERT_DIR, 'key.pem')),
      cert: fs.readFileSync(path.join(CERT_DIR, 'cert.pem'))
    }
  } catch (e) {
    console.error('[game-server] 缺少证书。请先运行:  bash server/gen-cert.sh')
    console.error('  或临时用明文调试:  PROTO=http node server/game-server.js')
    process.exit(1)
  }
  https.createServer(opts, handler).listen(PORT, () => {
    console.log(`[game-server] HTTPS listening on https://0.0.0.0:${PORT}`)
    console.log('  健康探针:  curl -k https://localhost:' + PORT + '/health')
  })
}

start()
