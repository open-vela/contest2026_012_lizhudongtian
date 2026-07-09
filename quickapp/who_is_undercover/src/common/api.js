/**
 * 《谁是卧底》手表端网络模块 —— 第 0 周连通性验证 + P1 底座
 *
 * 平台约束(见 docs/tech-design.md 第四/九节):
 *   - 快应用 API 白名单不含 WebSocket,只能用 @system.fetch。
 *   - 服务端必须 HTTPS;明文 HTTP 通常被拦截。
 * 因此传输采用「POST 提交动作 + GET 短轮询拉状态」的 server-authoritative 模型。
 */

import fetch from '@system.fetch'

// ---- 服务端地址 ----
// 模拟器/真机访问宿主机时,把 localhost 换成宿主机局域网 IP,
// 且证书 SAN 必须包含该 IP(见 server/gen-cert.sh 的 HOST_IP)。
let BASE_URL = 'https://localhost:8443'

export function setBaseUrl(url) {
  BASE_URL = String(url).replace(/\/+$/, '')
}
export function getBaseUrl() {
  return BASE_URL
}

/**
 * 统一请求封装。返回 Promise<{ code, data }>。
 * fail 回调一律 reject,交由调用方兜底(禁止静默失败,见 vela-quality 规则)。
 */
function request(pathname, method, body) {
  return new Promise((resolve, reject) => {
    const options = {
      url: BASE_URL + pathname,
      method: method || 'GET',
      responseType: 'json',
      header: { 'Content-Type': 'application/json' }
    }
    if (body !== undefined && body !== null) {
      options.data = JSON.stringify(body)
    }
    options.success = (res) => {
      // @system.fetch 的 res.data 在 responseType=json 下可能仍是字符串,做一次兜底解析
      let data = res.data
      if (typeof data === 'string') {
        try { data = JSON.parse(data) } catch (e) { /* 保留原始字符串 */ }
      }
      if (res.code >= 200 && res.code < 300) {
        resolve({ code: res.code, data })
      } else {
        reject({ code: res.code, data })
      }
    }
    options.fail = (data, code) => {
      console.error('[api] request failed: ' + method + ' ' + pathname + ' code=' + code)
      reject({ code: code, data: data })
    }
    fetch.fetch(options)
  })
}

// ---- 业务动作(对应 tech-design 第七节协议)----

export function health() {
  return request('/health', 'GET')
}

export function createRoom(name) {
  return request('/room', 'POST', { name: name })
}

export function joinRoom(roomId, name) {
  return request('/room/' + roomId + '/join', 'POST', { name: name })
}

export function startGame(roomId, playerId) {
  return request('/room/' + roomId + '/start', 'POST', { playerId: playerId })
}

export function submitVote(roomId, playerId, targetId) {
  return request('/room/' + roomId + '/vote', 'POST', { playerId: playerId, targetId: targetId })
}

export function nextPhase(roomId, playerId) {
  return request('/room/' + roomId + '/next', 'POST', { playerId: playerId })
}

/**
 * 轮询本视角快照。携带 since=上次 version,服务端无变更时返回 { unchanged:true }。
 */
export function pollState(roomId, playerId, sinceVersion) {
  const q = '?playerId=' + encodeURIComponent(playerId) + '&since=' + (sinceVersion || 0)
  return request('/room/' + roomId + '/state' + q, 'GET')
}

/**
 * 轮询控制器 —— 供页面在 onShow 启动、onHide/onDestroy 停止(功耗关键)。
 *
 *   const poller = createPoller(roomId, playerId, {
 *     interval: 1200,
 *     onUpdate: (view) => { ... },       // 有新版本时回调裁剪后的快照
 *     onError: (err, failCount) => { ... } // 连续失败计数,交页面决定是否提示
 *   })
 *   poller.start(); ... poller.stop()
 */
export function createPoller(roomId, playerId, opts) {
  opts = opts || {}
  const interval = opts.interval || 1200
  let timer = null
  let lastVersion = 0
  let failCount = 0
  let running = false

  function tick() {
    pollState(roomId, playerId, lastVersion)
      .then(({ data }) => {
        failCount = 0
        if (data && data.unchanged) return
        if (data && typeof data.version === 'number') {
          lastVersion = data.version
        }
        if (opts.onUpdate) opts.onUpdate(data)
      })
      .catch((err) => {
        failCount += 1
        // 单次失败不打断:保留上一帧,交页面按 failCount 决定是否提示
        if (opts.onError) opts.onError(err, failCount)
      })
  }

  return {
    start() {
      if (running) return
      running = true
      tick() // 立即拉一次,不等第一个间隔
      timer = setInterval(tick, interval)
    },
    stop() {
      running = false
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    },
    isRunning() { return running },
    getVersion() { return lastVersion }
  }
}
