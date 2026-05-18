import { BASE_URL } from '@/api/config'
import { pushDemoNotification } from '@/utils/demoNotifications'

/** 将 http(s) API 基址转为 ws(s)；后端要求 query token 且为管理员 */
export function wsStreamURL (token) {
  const base = String(BASE_URL || '').replace(/\/$/, '')
  if (!base) return ''
  let u = base.replace(/^http/, 'ws') + '/api/ws/stream'
  if (token) {
    u += '?token=' + encodeURIComponent(token)
  }
  return u
}

/**
 * 连接演示 WebSocket；收到 JSON 时写入本地通知队列。
 * @param {string} [token] JWT（须为管理员，与后端 /api/ws/stream 一致）
 * @returns {() => void} 关闭连接
 */
export function tryConnectWsDemo (onMessage, token) {
  const url = wsStreamURL(token)
  if (!url || !/^wss?:\/\//i.test(url) || !token) {
    return () => {}
  }
  let ws
  try {
    ws = new WebSocket(url)
  } catch (e) {
    void e
    return () => {}
  }
  ws.onmessage = (ev) => {
    try {
      const j = JSON.parse(ev.data)
      if (typeof onMessage === 'function') onMessage(j)
      if (j && j.title) {
        pushDemoNotification({
          title: String(j.title),
          body: String(j.body || ''),
          type: 'info'
        })
      }
    } catch (e) {
      void e
    }
  }
  ws.onerror = () => {}
  return () => {
    try {
      ws.close()
    } catch (e) {
      void e
    }
  }
}
