/**
 * 演示用站内通知（本地存储 + 定时注入，A13 可对接 WebSocket）
 */
const KEY = 'softeng_demo_notifications_v1'

export function listDemoNotifications () {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save (arr) {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 80)))
  } catch (e) {
    void e
  }
}

export function pushDemoNotification (payload) {
  const row = {
    id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    read: false,
    at: Date.now(),
    title: payload.title || '通知',
    body: payload.body || '',
    type: payload.type || 'info'
  }
  save([row, ...listDemoNotifications()])
  return row
}

export function unreadDemoCount () {
  return listDemoNotifications().filter(n => !n.read).length
}

export function markAllDemoRead () {
  const arr = listDemoNotifications().map(n => ({ ...n, read: true }))
  save(arr)
}

export function seedDemoNotificationsIfEmpty () {
  if (listDemoNotifications().length === 0) {
    pushDemoNotification({
      title: '欢迎使用演示通知',
      body: '后续可替换为 WebSocket / SSE 推送审核结果。当前为本地队列演示。',
      type: 'system'
    })
  }
}

let ticker = null
export function startDemoNotificationTicker (onTick) {
  if (ticker) return
  seedDemoNotificationsIfEmpty()
  ticker = window.setInterval(() => {
    const tips = [
      { title: '审核队列', body: '有新的资源进入待审队列（演示文案）。' },
      { title: '系统提示', body: '建议定期查看「事件时间线」了解本机操作轨迹。' },
      { title: '学习助手', body: '试试侧栏「RAG 助手」检索课程与项目。' }
    ]
    const pick = tips[Math.floor(Math.random() * tips.length)]
    pushDemoNotification(pick)
    if (typeof onTick === 'function') onTick()
  }, 120000)
}

export function stopDemoNotificationTicker () {
  if (ticker) {
    clearInterval(ticker)
    ticker = null
  }
}
