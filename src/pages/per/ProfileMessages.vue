<!-- pages/per/ProfileMessages.vue -->
<template>
  <div class="profile-messages">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-envelope"></i>
        站内消息
      </h1>
      <div class="page-actions">
        <button @click="refreshMessages" class="refresh-btn">
          <i class="fas fa-sync-alt"></i>
          刷新
        </button>
        <button @click="markAllAsRead" class="action-btn">
          <i class="fas fa-check-double"></i>
          全部已读
        </button>
        <button @click="showSendDialog" class="action-btn primary">
          <i class="fas fa-paper-plane"></i>
          发送消息
        </button>
      </div>
    </div>

    <!-- 消息统计 -->
    <div class="message-stats">
      <div class="stat-item">
        <div class="stat-icon unread">
          <i class="fas fa-envelope"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ unreadCount }}</span>
          <span class="stat-label">未读消息</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon total">
          <i class="fas fa-inbox"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ totalMessages }}</span>
          <span class="stat-label">全部消息</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon sent">
          <i class="fas fa-paper-plane"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ sentCount }}</span>
          <span class="stat-label">已发送</span>
        </div>
      </div>
    </div>

    <div class="messages-container">
      <!-- 左侧消息列表 -->
      <div class="messages-sidebar">
        <div class="sidebar-header">
          <h3 class="sidebar-title">消息列表</h3>
          <div class="filter-tabs">
            <button
              v-for="tab in messageTabs"
              :key="tab.id"
              :class="['tab-btn', { active: activeTab === tab.id }]"
              @click="switchTab(tab.id)"
            >
              {{ tab.name }}
              <span class="tab-badge">{{ getTabCount(tab.id) }}</span>
            </button>
          </div>
        </div>

        <div class="messages-list">
          <div v-if="loading" class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            加载消息...
          </div>

          <div v-else-if="filteredMessages.length === 0" class="empty-state">
            <i class="fas fa-inbox"></i>
            <p>{{ emptyMessage }}</p>
          </div>

          <div v-else class="message-items">
            <div
              v-for="message in filteredMessages"
              :key="message.id"
              :class="['message-item', { unread: !message.read, active: activeMessage?.id === message.id }]"
              @click="selectMessage(message)"
            >
              <div class="message-avatar">
                <img :src="getUserAvatarUrl(message.sender.avatar, message.sender.name, message.sender.email)" :alt="message.sender.name" class="avatar">
                <div v-if="!message.read" class="unread-dot"></div>
              </div>

              <div class="message-info">
                <div class="message-header">
                  <div class="sender-info">
                    <span class="sender-name">{{ message.sender.name }}</span>
                    <span class="sender-badge" v-if="message.sender.role === 'admin'">官方</span>
                  </div>
                  <div class="message-time">
                    {{ formatTime(message.createdAt) }}
                  </div>
                </div>

                <div class="message-preview">
                  <p class="message-title">{{ message.title }}</p>
                  <p class="message-excerpt">{{ message.content }}</p>
                </div>

                <div class="message-meta">
                  <span class="meta-item">
                    <i class="fas fa-tag"></i>
                    {{ getTypeLabel(message.type) }}
                  </span>
                  <span v-if="message.hasAttachments" class="meta-item">
                    <i class="fas fa-paperclip"></i>
                    附件
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧消息详情 -->
      <div class="message-detail" v-if="activeMessage">
        <div class="detail-header">
          <div class="detail-header-left">
            <button @click="activeMessage = null" class="back-btn">
              <i class="fas fa-arrow-left"></i>
              返回列表
            </button>
          </div>

          <div class="detail-header-right">
            <div class="message-actions">
              <button @click="toggleStar(activeMessage)" class="action-btn" :title="activeMessage.starred ? '取消星标' : '标记星标'">
                <i :class="['far', activeMessage.starred ? 'fa-star' : 'fa-star']" :style="{ color: activeMessage.starred ? '#f6ad55' : '#a0aec0' }"></i>
              </button>
              <button @click="deleteMessage(activeMessage)" class="action-btn" title="删除">
                <i class="far fa-trash-alt"></i>
              </button>
              <button @click="replyMessage(activeMessage)" class="action-btn" title="回复">
                <i class="fas fa-reply"></i>
              </button>
              <button @click="forwardMessage(activeMessage)" class="action-btn" title="转发">
                <i class="fas fa-share"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="detail-content">
          <!-- 消息头部 -->
          <div class="message-header-detail">
            <div class="sender-detail">
              <img :src="getUserAvatarUrl(activeMessage.sender.avatar, activeMessage.sender.name, activeMessage.sender.email)" :alt="activeMessage.sender.name" class="sender-avatar">
              <div class="sender-info-detail">
                <div class="sender-name-detail">
                  <span>{{ activeMessage.sender.name }}</span>
                  <span v-if="activeMessage.sender.role === 'admin'" class="sender-badge">官方</span>
                </div>
                <div class="sender-email">
                  <i class="fas fa-envelope"></i>
                  {{ activeMessage.sender.email || '未知邮箱' }}
                </div>
              </div>
            </div>

            <div class="message-info-detail">
              <div class="info-item">
                <i class="fas fa-clock"></i>
                <span>发送时间：{{ formatFullTime(activeMessage.createdAt) }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-tag"></i>
                <span>类型：{{ getTypeLabel(activeMessage.type) }}</span>
              </div>
              <div v-if="activeMessage.threadId" class="info-item">
                <i class="fas fa-link"></i>
                <span>相关资源：{{ activeMessage.threadTitle }}</span>
              </div>
            </div>
          </div>

          <!-- 消息标题 -->
          <div class="message-title-detail">
            <h2>{{ activeMessage.title }}</h2>
            <div class="title-tags">
              <span v-if="!activeMessage.read" class="status-tag unread">未读</span>
              <span v-if="activeMessage.important" class="status-tag important">重要</span>
              <span v-if="activeMessage.urgent" class="status-tag urgent">紧急</span>
            </div>
          </div>

          <!-- 消息正文 -->
          <div class="message-body">
            <div class="message-content" v-html="formatMessageContent(activeMessage.content)"></div>

            <!-- 附件 -->
            <div v-if="activeMessage.attachments && activeMessage.attachments.length > 0" class="message-attachments">
              <h4 class="attachments-title">
                <i class="fas fa-paperclip"></i>
                附件（{{ activeMessage.attachments.length }}个）
              </h4>
              <div class="attachments-list">
                <div v-for="attachment in activeMessage.attachments" :key="attachment.id" class="attachment-item">
                  <div class="attachment-icon">
                    <i :class="getFileIcon(attachment.type)"></i>
                  </div>
                  <div class="attachment-info">
                    <div class="attachment-name">{{ attachment.name }}</div>
                    <div class="attachment-meta">
                      <span>{{ attachment.size }}</span>
                      <span>•</span>
                      <span>{{ attachment.type.toUpperCase() }}</span>
                    </div>
                  </div>
                  <button @click="downloadAttachment(attachment)" class="attachment-download">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 回复区域 -->
          <div class="message-reply">
            <div class="reply-header">
              <h4><i class="fas fa-reply"></i> 回复此消息</h4>
            </div>
            <div class="reply-editor">
              <textarea
                v-model="replyContent"
                placeholder="输入回复内容..."
                rows="4"
                class="reply-textarea"
              ></textarea>
              <div class="reply-actions">
                <div class="reply-tools">
                  <button @click="attachFile" class="tool-btn" title="添加附件">
                    <i class="fas fa-paperclip"></i>
                  </button>
                  <button @click="insertEmoji" class="tool-btn" title="插入表情">
                    <i class="far fa-smile"></i>
                  </button>
                  <button @click="formatText('bold')" class="tool-btn" title="加粗">
                    <i class="fas fa-bold"></i>
                  </button>
                  <button @click="formatText('italic')" class="tool-btn" title="斜体">
                    <i class="fas fa-italic"></i>
                  </button>
                </div>
                <div class="reply-buttons">
                  <button @click="cancelReply" class="cancel-btn">取消</button>
                  <button @click="sendReply" class="send-btn">
                    <i class="fas fa-paper-plane"></i>
                    发送回复
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-message-selected">
        <div class="no-message-content">
          <i class="fas fa-envelope-open"></i>
          <h3>选择一条消息查看详情</h3>
          <p>从左侧列表中选择消息进行查看、回复或管理</p>
        </div>
      </div>
    </div>

    <!-- 发送消息对话框 -->
    <el-dialog
      v-model="sendDialogVisible"
      title="发送新消息"
      width="600px"
      @closed="resetSendForm"
    >
      <div class="send-message-form">
        <el-form :model="sendForm" :rules="sendRules" ref="sendFormRef">
          <el-form-item label="收件人" prop="recipient">
            <el-select
              v-model="sendForm.recipient"
              filterable
              remote
              reserve-keyword
              placeholder="请输入用户名或邮箱"
              remote-show-suffix
              :remote-method="searchUsers"
              :loading="searchLoading"
            >
              <el-option
                v-for="user in searchResults"
                :key="user.id"
                :label="`${user.name} (${user.email})`"
                :value="user.id"
              >
                <div class="user-option">
                  <img :src="getUserAvatarUrl(user.avatar, user.name, user.email)" class="option-avatar">
                  <div class="option-info">
                    <span class="option-name">{{ user.name }}</span>
                    <span class="option-email">{{ user.email }}</span>
                  </div>
                </div>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="消息类型" prop="type">
            <el-select v-model="sendForm.type" placeholder="选择消息类型">
              <el-option label="普通消息" value="normal"></el-option>
              <el-option label="系统通知" value="system"></el-option>
              <el-option label="重要通知" value="important"></el-option>
              <el-option label="私信" value="private"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="主题" prop="subject">
            <el-input
              v-model="sendForm.subject"
              placeholder="请输入消息主题"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="内容" prop="content">
            <el-input
              v-model="sendForm.content"
              type="textarea"
              :rows="6"
              placeholder="请输入消息内容..."
              maxlength="1000"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="附件" prop="attachments">
            <el-upload
              class="upload-attachments"
              action="#"
              multiple
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
              :file-list="sendForm.attachments"
              :auto-upload="false"
              list-type="text"
            >
              <el-button type="primary">
                <i class="fas fa-plus"></i>
                添加附件
              </el-button>
              <template #tip>
                <div class="upload-tip">
                  支持上传图片、文档等文件，单个文件不超过10MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sendDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitSendMessage"
            :loading="sendLoading"
          >
            发送消息
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserAvatarUrl } from '@/utils/avatar'
// import axios from 'axios'

const store = useStore()

// 状态
const loading = ref(false)
const activeTab = ref('inbox')
const activeMessage = ref(null)
const replyContent = ref('')
const sendDialogVisible = ref(false)
const searchLoading = ref(false)
const sendLoading = ref(false)

// 数据
const messages = ref([])
const searchResults = ref([])

const messageTabs = [
  { id: 'inbox', name: '收件箱', icon: 'fa-inbox' },
  { id: 'unread', name: '未读', icon: 'fa-envelope' },
  { id: 'starred', name: '星标', icon: 'fa-star' },
  { id: 'sent', name: '已发送', icon: 'fa-paper-plane' }
]

const sendForm = ref({
  recipient: '',
  type: 'normal',
  subject: '',
  content: '',
  attachments: []
})

const sendRules = {
  recipient: [
    { required: true, message: '请选择收件人', trigger: 'change' }
  ],
  subject: [
    { required: true, message: '请输入消息主题', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入消息内容', trigger: 'blur' },
    { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur' }
  ]
}

// 计算属性（后端todo）
const unreadCount = computed(() =>
  messages.value.filter(msg => !msg.read && msg.type !== 'sent').length
)

const totalMessages = computed(() =>
  messages.value.filter(msg => msg.type !== 'sent').length
)

const sentCount = computed(() =>
  messages.value.filter(msg => msg.type === 'sent').length
)

const filteredMessages = computed(() => {
  if (activeTab.value === 'inbox') {
    return messages.value.filter(msg => msg.type !== 'sent')
  } else if (activeTab.value === 'unread') {
    return messages.value.filter(msg => !msg.read && msg.type !== 'sent')
  } else if (activeTab.value === 'starred') {
    return messages.value.filter(msg => msg.starred)
  } else if (activeTab.value === 'sent') {
    return messages.value.filter(msg => msg.type === 'sent')
  }
  return messages.value
})

const emptyMessage = computed(() => {
  const messages = {
    inbox: '收件箱为空',
    unread: '没有未读消息',
    starred: '没有星标消息',
    sent: '没有已发送消息'
  }
  return messages[activeTab.value] || '没有消息'
})

// 方法
const getTabCount = (tabId) => {
  switch (tabId) {
    case 'inbox': return totalMessages.value
    case 'unread': return unreadCount.value
    case 'starred': return messages.value.filter(msg => msg.starred).length
    case 'sent': return sentCount.value
    default: return 0
  }
}


const getTypeLabel = (type) => {
  const labels = {
    normal: '普通消息',
    system: '系统通知',
    important: '重要通知',
    private: '私信',
    sent: '已发送'
  }
  return labels[type] || type
}

const getFileIcon = (fileType) => {
  const icons = {
    pdf: 'fas fa-file-pdf',
    doc: 'fas fa-file-word',
    docx: 'fas fa-file-word',
    xls: 'fas fa-file-excel',
    xlsx: 'fas fa-file-excel',
    ppt: 'fas fa-file-powerpoint',
    pptx: 'fas fa-file-powerpoint',
    jpg: 'fas fa-file-image',
    jpeg: 'fas fa-file-image',
    png: 'fas fa-file-image',
    gif: 'fas fa-file-image',
    zip: 'fas fa-file-archive',
    rar: 'fas fa-file-archive',
    txt: 'fas fa-file-alt'
  }

  const ext = fileType.split('/').pop().toLowerCase()
  return icons[ext] || 'fas fa-file'
}

const formatTime = (timestamp) => {
  const now = new Date()
  const date = new Date(timestamp)
  const diff = now - date

  if (diff < 60 * 60 * 1000) { // 1小时内
    return '刚刚'
  } else if (diff < 24 * 60 * 60 * 1000) { // 24小时内
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  } else if (diff < 7 * 24 * 60 * 60 * 1000) { // 7天内
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const formatFullTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatMessageContent = (content) => {
  // 简单格式化，实际应用中可能需要更复杂的处理
  return content.replace(/\n/g, '<br>')
}

// 模拟数据
const mockMessages = [
  {
    id: 1,
    type: 'system',
    title: '系统维护通知',
    content: '为了提供更好的服务，我们将于本周六凌晨2:00-4:00进行系统维护。在此期间，网站将暂时无法访问。感谢您的理解与支持。',
    sender: {
      id: 1,
      name: '系统管理员',
      email: 'admin@system.com',
      avatar: 'https://picsum.photos/seed/admin/200/200',
      role: 'admin'
    },
    read: false,
    starred: true,
    important: true,
    urgent: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
    hasAttachments: false
  },
  {
    id: 2,
    type: 'normal',
    title: '关于您提交的工具审核结果',
    content: '您提交的工具"代码格式化工具"已经通过审核，现已上线。感谢您的贡献！',
    sender: {
      id: 2,
      name: '审核团队',
      email: 'review@system.com',
      avatar: 'https://picsum.photos/seed/review/200/200',
      role: 'admin'
    },
    read: true,
    starred: false,
    important: false,
    urgent: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1天前
    threadId: 'tool-123',
    threadTitle: '代码格式化工具',
    hasAttachments: false
  },
  {
    id: 3,
    type: 'private',
    title: '关于项目合作邀请',
    content: '您好！我看到您在平台上的项目展示，非常有兴趣与您合作。请问是否有时间详细沟通？',
    sender: {
      id: 3,
      name: '张明',
      email: 'zhangming@example.com',
      avatar: 'https://picsum.photos/seed/user1/200/200',
      role: 'user'
    },
    read: false,
    starred: false,
    important: false,
    urgent: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
    hasAttachments: true,
    attachments: [
      { id: 1, name: '合作方案.pdf', size: '2.4MB', type: 'pdf' },
      { id: 2, name: '项目计划书.docx', size: '1.8MB', type: 'docx' }
    ]
  },
  {
    id: 4,
    type: 'sent',
    title: '回复：关于项目合作邀请',
    content: '感谢您的邀请！我对您的合作意向很感兴趣，我们可以在下周安排一次线上会议。',
    sender: {
      id: 4,
      name: '我',
      email: store.state.user.email,
      avatar: store.state.user.avatar,
      role: 'user'
    },
    recipient: {
      name: '张明',
      email: 'zhangming@example.com'
    },
    read: true,
    starred: false,
    important: false,
    urgent: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
    hasAttachments: false
  }
]

const fetchMessages = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    messages.value = mockMessages
  } catch (error) {
    console.error('获取消息失败:', error)
    ElMessage.error('获取消息失败')
  } finally {
    loading.value = false
  }
}

// 后端可以参考
// const fetchMessages = async () => {
//   loading.value = true
//   try {
//     // 实际API调用 - 替换这里的URL为您的后端接口
//     const response = await axios.get('/api/messages', {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//
//     if (response.data.success) {
//       messages.value = response.data.data
//     } else {
//       throw new Error(response.data.message || '获取消息失败')
//     }
//   } catch (error) {
//     console.error('获取消息失败:', error)
//     ElMessage.error('获取消息失败')
//
//     // 如果API失败，使用模拟数据（仅开发环境）
//     if (process.env.NODE_ENV === 'development') {
//       console.warn('使用模拟数据')
//       messages.value = mockMessages
//     }
//   } finally {
//     loading.value = false
//   }
// }

const switchTab = (tabId) => {
  activeTab.value = tabId
  activeMessage.value = null
}

const selectMessage = (message) => {
  activeMessage.value = message
  // 标记为已读
  if (!message.read) {
    message.read = true
    // 实际应该调用API标记为已读
  }
}

// 后端修改可参考
// const selectMessage = async (message) => {
//   activeMessage.value = message
//
//   // 如果未读，标记为已读
//   if (!message.read) {
//     try {
//       const response = await axios.put(`/api/messages/${message.id}/read`, {}, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       })
//
//       if (response.data.success) {
//         message.read = true
//       }
//     } catch (error) {
//       console.error('标记已读失败:', error)
//     }
//   }
// }

const toggleStar = (message) => {
  message.starred = !message.starred
  ElMessage.success(message.starred ? '已标记星标' : '已取消星标')
}

// 后端可参考
// const toggleStar = async (message) => {
//   try {
//     const response = await axios.put(`/api/messages/${message.id}/star`, {
//       starred: !message.starred
//     }, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//
//     if (response.data.success) {
//       message.starred = !message.starred
//       ElMessage.success(message.starred ? '已标记星标' : '已取消星标')
//     }
//   } catch (error) {
//     console.error('标记星标失败:', error)
//     ElMessage.error('操作失败')
//   }
// }

const deleteMessage = (message) => {
  ElMessageBox.confirm(
    `确定要删除"${message.title}"吗？`,
    '删除消息',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    messages.value = messages.value.filter(msg => msg.id !== message.id)
    activeMessage.value = null
    ElMessage.success('消息已删除')
  })
}

// 修改deleteMessage为真实API调用
// const deleteMessage = async (message) => {
//   ElMessageBox.confirm(
//     `确定要删除"${message.title}"吗？`,
//     '删除消息',
//     {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning'
//     }
//   ).then(async () => {
//     try {
//       const response = await axios.delete(`/api/messages/${message.id}`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       })
//
//       if (response.data.success) {
//         messages.value = messages.value.filter(msg => msg.id !== message.id)
//         activeMessage.value = null
//         ElMessage.success('消息已删除')
//       }
//     } catch (error) {
//       console.error('删除消息失败:', error)
//       ElMessage.error('删除失败')
//     }
//   })
// }

const replyMessage = (message) => {
  replyContent.value = `\n\n---\n\n回复 "${message.sender.name}" 的消息：\n${message.content}\n`
  // 滚动到回复区域
  nextTick(() => {
    const replyArea = document.querySelector('.reply-textarea')
    if (replyArea) {
      replyArea.focus()
      replyArea.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

const forwardMessage = (message) => {
  sendDialogVisible.value = true
  // 预填充转发内容
  nextTick(() => {
    sendForm.value.subject = `转发：${message.title}`
    sendForm.value.content = `\n\n---\n\n转发消息：\n${message.content}\n\n发送者：${message.sender.name}\n发送时间：${formatFullTime(message.createdAt)}`
  })
}

const downloadAttachment = (attachment) => {
  ElMessage.info(`开始下载：${attachment.name}`)
  // 实际应该调用下载API
}

// 修改downloadAttachment为真实API调用
// const downloadAttachment = async (attachment) => {
//   try {
//     const response = await axios.get(`/api/messages/attachments/${attachment.id}/download`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       responseType: 'blob'
//     })
//
//     // 创建下载链接
//     const url = window.URL.createObjectURL(new Blob([response.data]))
//     const link = document.createElement('a')
//     link.href = url
//     link.setAttribute('download', attachment.name)
//     document.body.appendChild(link)
//     link.click()
//     link.remove()
//
//     ElMessage.success('开始下载')
//   } catch (error) {
//     console.error('下载附件失败:', error)
//     ElMessage.error('下载失败')
//   }
// }

const attachFile = () => {
  ElMessage.info('添加附件功能')
}

const insertEmoji = () => {
  ElMessage.info('插入表情功能')
}

const formatText = (type) => {
  const textarea = document.querySelector('.reply-textarea')
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = replyContent.value.substring(start, end)

  let formattedText = selectedText
  switch (type) {
    case 'bold':
      formattedText = `**${selectedText}**`
      break
    case 'italic':
      formattedText = `*${selectedText}*`
      break
    default:
      break
  }

  replyContent.value =
    replyContent.value.substring(0, start) +
    formattedText +
    replyContent.value.substring(end)
}

const cancelReply = () => {
  replyContent.value = ''
}

const sendReply = () => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }

  // 模拟发送回复
  const newMessage = {
    id: messages.value.length + 1,
    type: 'sent',
    title: `回复：${activeMessage.value.title}`,
    content: replyContent.value,
    sender: {
      id: 0,
      name: '我',
      email: store.state.user.email,
      avatar: store.state.user.avatar,
      role: 'user'
    },
    recipient: activeMessage.value.sender,
    read: true,
    starred: false,
    important: false,
    urgent: false,
    createdAt: new Date(),
    hasAttachments: false
  }

  messages.value.unshift(newMessage)
  replyContent.value = ''
  ElMessage.success('回复已发送')
}

// 修改sendReply为真实API调用
// const sendReply = async () => {
//   if (!replyContent.value.trim()) {
//     ElMessage.warning('请输入回复内容')
//     return
//   }
//
//   if (!activeMessage.value) {
//     ElMessage.warning('请选择要回复的消息')
//     return
//   }
//
//   try {
//     const response = await axios.post('/api/messages', {
//       recipientId: activeMessage.value.sender.id,
//       title: `回复：${activeMessage.value.title}`,
//       content: replyContent.value,
//       type: 'normal',
//       parentId: activeMessage.value.id
//     }, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//
//     if (response.data.success) {
//       const newMessage = response.data.data
//       messages.value.unshift(newMessage)
//       replyContent.value = ''
//       ElMessage.success('回复已发送')
//     }
//   } catch (error) {
//     console.error('发送回复失败:', error)
//     ElMessage.error('发送失败')
//   }
// }

const refreshMessages = () => {
  fetchMessages()
}

const markAllAsRead = () => {
  messages.value.forEach(msg => {
    if (!msg.read && msg.type !== 'sent') {
      msg.read = true
    }
  })
  ElMessage.success('全部标记为已读')
}

// 后端可以参考调用
// const markAllAsRead = async () => {
//   try {
//     // 实际API调用
//     const response = await axios.post('/api/messages/mark-all-read', {}, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//
//     if (response.data.success) {
//       // 更新本地状态
//       messages.value.forEach(msg => {
//         if (!msg.read && msg.type !== 'sent') {
//           msg.read = true
//         }
//       })
//       ElMessage.success('全部标记为已读')
//     } else {
//       throw new Error(response.data.message || '标记失败')
//     }
//   } catch (error) {
//     console.error('标记已读失败:', error)
//     ElMessage.error('标记已读失败')
//   }
// }

const showSendDialog = () => {
  sendDialogVisible.value = true
}

const searchUsers = async (query) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }

  searchLoading.value = true
  try {
    // 模拟搜索用户
    await new Promise(resolve => setTimeout(resolve, 500))
    searchResults.value = [
      { id: 1, name: '张明', email: 'zhangming@example.com', avatar: 'https://picsum.photos/seed/user1/50/50' },
      { id: 2, name: '李华', email: 'lihua@example.com', avatar: 'https://picsum.photos/seed/user2/50/50' },
      { id: 3, name: '王伟', email: 'wangwei@example.com', avatar: 'https://picsum.photos/seed/user3/50/50' }
    ].filter(user =>
      user.name.includes(query) || user.email.includes(query)
    )
  } catch (error) {
    console.error('搜索用户失败:', error)
  } finally {
    searchLoading.value = false
  }
}

// 修改searchUsers为真实API调用
// const searchUsers = async (query) => {
//   if (!query.trim()) {
//     searchResults.value = []
//     return
//   }
//
//   searchLoading.value = true
//   try {
//     // 实际API调用
//     const response = await axios.get('/api/users/search', {
//       params: { q: query },
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//
//     if (response.data.success) {
//       searchResults.value = response.data.data
//     }
//   } catch (error) {
//     console.error('搜索用户失败:', error)
//     searchResults.value = [] // 失败时清空结果
//   } finally {
//     searchLoading.value = false
//   }
// }

const handleFileChange = (file, fileList) => {
  sendForm.value.attachments = fileList
}

const handleFileRemove = (file, fileList) => {
  sendForm.value.attachments = fileList
}

const resetSendForm = () => {
  sendForm.value = {
    recipient: '',
    type: 'normal',
    subject: '',
    content: '',
    attachments: []
  }
  searchResults.value = []
}

const submitSendMessage = async () => {
  try {
    sendLoading.value = true

    // 模拟发送消息
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newMessage = {
      id: messages.value.length + 1,
      type: 'sent',
      title: sendForm.value.subject,
      content: sendForm.value.content,
      sender: {
        id: 0,
        name: '我',
        email: store.state.user.email,
        avatar: store.state.user.avatar,
        role: 'user'
      },
      recipient: {
        name: sendForm.value.recipient,
        email: sendForm.value.recipient + '@example.com'
      },
      read: true,
      starred: false,
      important: sendForm.value.type === 'important',
      urgent: false,
      createdAt: new Date(),
      hasAttachments: sendForm.value.attachments.length > 0,
      attachments: sendForm.value.attachments.map(file => ({
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        type: file.type || 'unknown'
      }))
    }

    messages.value.unshift(newMessage)
    sendDialogVisible.value = false
    activeTab.value = 'sent'
    activeMessage.value = newMessage

    ElMessage.success('消息发送成功')
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送消息失败')
  } finally {
    sendLoading.value = false
  }
}

// 修改submitSendMessage为真实API调用
// const submitSendMessage = async () => {
//   try {
//     sendLoading.value = true
//
//     // 验证表单
//     if (!sendForm.value.recipient) {
//       ElMessage.warning('请选择收件人')
//       return
//     }
//
//     if (!sendForm.value.subject.trim()) {
//       ElMessage.warning('请输入消息主题')
//       return
//     }
//
//     if (!sendForm.value.content.trim()) {
//       ElMessage.warning('请输入消息内容')
//       return
//     }
//
//     // 处理附件上传
//     const formData = new FormData()
//     formData.append('recipientId', sendForm.value.recipient)
//     formData.append('title', sendForm.value.subject)
//     formData.append('content', sendForm.value.content)
//     formData.append('type', sendForm.value.type)
//
//     sendForm.value.attachments.forEach((file, index) => {
//       formData.append(`attachments[${index}]`, file.raw)
//     })
//
//     // 实际API调用
//     const response = await axios.post('/api/messages', formData, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'multipart/form-data'
//       }
//     })
//
//     if (response.data.success) {
//       const newMessage = response.data.data
//       messages.value.unshift(newMessage)
//       sendDialogVisible.value = false
//       activeTab.value = 'sent'
//       activeMessage.value = newMessage
//
//       ElMessage.success('消息发送成功')
//     }
//   } catch (error) {
//     console.error('发送消息失败:', error)
//     ElMessage.error('发送消息失败')
//   } finally {
//     sendLoading.value = false
//   }
// }

onMounted(() => {
  fetchMessages()
})
</script>

<style lang="scss" scoped>
.profile-messages {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;

    i {
      color: #4299e1;
    }
  }

  .page-actions {
    display: flex;
    gap: 12px;

    .refresh-btn {
      padding: 10px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .action-btn {
      padding: 10px 20px;
      background: #ffffff;
      color: #4a5568;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
      min-width: 100px; /* 设置最小宽度 */
      max-width: 100%; /* 限制最大宽度 */
      white-space: nowrap; /* 防止文字换行 */
      overflow: hidden; /* 隐藏溢出内容 */
      text-overflow: ellipsis; /* 文字溢出显示省略号 */
      font-size: 14px; /* 设置固定字体大小 */
      line-height: 1.5; /* 设置行高 */
      height: 42px; /* 固定高度 */
      box-sizing: border-box; /* 确保padding不会影响整体尺寸 */

      &:hover {
        background: #f7fafc;
        border-color: #cbd5e0;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      &.primary {
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        color: white;
        border: none;
        box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
        min-width: 120px; /* 主要按钮稍微宽一点 */

        &:hover {
          background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
        }
      }

      /* 添加不同尺寸的按钮 */
      &.small {
        padding: 6px 12px;
        font-size: 12px;
        min-width: 80px;
        height: 32px;
      }

      &.large {
        padding: 14px 28px;
        font-size: 16px;
        min-width: 140px;
        height: 52px;
      }

      /* 当按钮在flex容器中时，允许适当缩小 */
      .page-actions & {
        flex-shrink: 1;
        flex-grow: 0;
        flex-basis: auto;
      }

      /* 图标和文字的组合 */
      i {
        font-size: 14px;
        flex-shrink: 0; /* 防止图标被压缩 */
      }

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* 仅图标的按钮 */
      &.icon-only {
        min-width: 42px;
        width: 42px;
        height: 42px;
        padding: 0;
        justify-content: center;

        i {
          font-size: 16px;
        }
      }

      /* 长文字按钮的特殊处理 */
      &.long-text {
        white-space: normal; /* 允许换行 */
        min-height: 42px; /* 最小高度 */
        height: auto; /* 高度自适应 */
        line-height: 1.3; /* 调整行高 */

        span {
          white-space: normal; /* 允许文字换行 */
          word-break: break-word; /* 允许单词换行 */
        }
      }

      /* 响应式调整 */
      @media (max-width: 768px) {
        min-width: 90px;
        padding: 8px 16px;
        font-size: 13px;

        &.primary {
          min-width: 100px;
        }

        &.large {
          min-width: 120px;
          padding: 12px 20px;
        }

        /* 在小屏幕上，长文字按钮使用换行 */
        &.long-text {
          white-space: normal;
          min-height: auto;
          height: auto;
          padding: 8px 12px;
        }
      }

      @media (max-width: 480px) {
        min-width: 80px;
        padding: 6px 12px;
        font-size: 12px;

        &.primary {
          min-width: 90px;
        }

        /* 在手机上，所有按钮都允许文字换行 */
        span {
          white-space: normal;
          line-height: 1.2;
        }

        /* 手机上调整图标和文字间距 */
        gap: 6px;
      }
    }
  }

  .refresh-btn {
    padding: 8px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  }

  .action-btn {
    padding: 8px 16px;
    background: #e2e8f0;
    color: #4a5568;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: #cbd5e0;
      transform: translateY(-1px);
    }

    &.primary {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;

      &:hover {
        background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
      }
    }
  }

  .message-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    border: 1px solid #e2e8f0;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;

    &.unread {
      background: linear-gradient(135deg, #ed64a6 0%, #d53f8c 100%);
    }

    &.total {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    &.sent {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    }
  }

  .stat-content {
    .stat-value {
      display: block;
      font-size: 28px;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      color: #718096;
    }
  }

  .messages-container {
    display: flex;
    gap: 24px;
    min-height: 600px;
  }

  .messages-sidebar {
    flex: 0 0 380px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sidebar-header {
    padding: 20px;
    border-bottom: 2px solid #e2e8f0;
  }

  .sidebar-title {
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 16px 0;
  }

  .filter-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 8px 16px;
    background: #f7fafc;
    border: 2px solid #e2e8f0;
    border-radius: 20px;
    color: #4a5568;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover {
      border-color: #cbd5e0;
      background: #edf2f7;
    }

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: #667eea;
    }

    .tab-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
    }
  }

  .messages-list {
    flex: 1;
    overflow-y: auto;
  }

  .loading-state, .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;

    i {
      font-size: 48px;
      color: #a0aec0;
      margin-bottom: 16px;
    }

    p {
      color: #718096;
      font-size: 16px;
    }
  }

  .message-items {
    padding: 8px;
  }

  .message-item {
    display: flex;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 8px;
    border: 2px solid transparent;

    &:hover {
      background: #f7fafc;
      border-color: #e2e8f0;
    }

    &.active {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      border-color: #667eea;
    }

    &.unread {
      background: #f0f9ff;
      border-color: #bee3f8;
    }
  }

  .message-avatar {
    position: relative;
    flex-shrink: 0;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .unread-dot {
    position: absolute;
    top: 0;
    right: 0;
    width: 12px;
    height: 12px;
    background: #ed64a6;
    border: 2px solid white;
    border-radius: 50%;
  }

  .message-info {
    flex: 1;
    min-width: 0;
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .sender-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sender-name {
    font-size: 14px;
    font-weight: 600;
    color: #2d3748;
  }

  .sender-badge {
    font-size: 10px;
    padding: 2px 6px;
    background: #4299e1;
    color: white;
    border-radius: 4px;
    font-weight: 500;
  }

  .message-time {
    font-size: 12px;
    color: #a0aec0;
    white-space: nowrap;
  }

  .message-preview {
    margin-bottom: 8px;

    .message-title {
      font-size: 14px;
      font-weight: 500;
      color: #2d3748;
      margin: 0 0 4px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .message-excerpt {
      font-size: 13px;
      color: #718096;
      margin: 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .message-meta {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #a0aec0;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .message-detail {
    flex: 1;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 2px solid #e2e8f0;
    background: #f7fafc;
  }

  .back-btn {
    padding: 8px 16px;
    background: transparent;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #cbd5e0;
      background: #edf2f7;
    }
  }

  .message-actions {
    display: flex;
    gap: 8px;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    color: #4a5568;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      border-color: #cbd5e0;
      background: #f7fafc;
      transform: translateY(-1px);
    }
  }

  .detail-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
  }

  .message-header-detail {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 24px;
    border-bottom: 2px solid #e2e8f0;
    margin-bottom: 24px;
  }

  .sender-detail {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .sender-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .sender-info-detail {
    .sender-name-detail {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;

      span {
        font-size: 20px;
        font-weight: 600;
        color: #2d3748;
      }

      .sender-badge {
        font-size: 12px;
        padding: 4px 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 6px;
        font-weight: 500;
      }
    }

    .sender-email {
      font-size: 14px;
      color: #718096;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .message-info-detail {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #718096;

    i {
      width: 16px;
      text-align: center;
    }
  }

  .send-message-form {
    .el-form-item__label {
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 8px;
    }

    .el-select, .el-input {
      width: 100%;
    }
  }

  .message-title-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      font-size: 24px;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
    }
  }

  .title-tags {
    display: flex;
    gap: 8px;
  }

  .status-tag {
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;

    &.unread {
      background: #fed7d7;
      color: #c53030;
    }

    &.important {
      background: #fefcbf;
      color: #975a16;
    }

    &.urgent {
      background: #fed7d7;
      color: #c53030;
    }
  }

  .message-body {
    margin-bottom: 32px;
  }

  .message-content {
    font-size: 16px;
    line-height: 1.6;
    color: #2d3748;
    margin-bottom: 24px;

    p {
      margin: 0 0 16px 0;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .message-attachments {
    .attachments-title {
      font-size: 16px;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .attachments-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .attachment-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #cbd5e0;
      background: #f7fafc;
    }
  }

  .attachment-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
  }

  .attachment-info {
    flex: 1;
    min-width: 0;

    .attachment-name {
      font-size: 14px;
      font-weight: 500;
      color: #2d3748;
      margin-bottom: 4px;
      word-break: break-all;
    }

    .attachment-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #a0aec0;
    }
  }

  .attachment-download {
    width: 36px;
    height: 36px;
    background: #48bb78;
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      background: #38a169;
      transform: scale(1.05);
    }
  }

  .message-reply {
    .reply-header {
      margin-bottom: 16px;

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #2d3748;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }

  .reply-editor {
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
  }

  .reply-textarea {
    width: 100%;
    padding: 16px;
    border: none;
    border-bottom: 2px solid #e2e8f0;
    font-size: 14px;
    line-height: 1.5;
    color: #2d3748;
    resize: vertical;
    min-height: 100px;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #a0aec0;
    }
  }

  .reply-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #f7fafc;
  }

  .reply-tools {
    display: flex;
    gap: 8px;
  }

  .tool-btn {
    width: 32px;
    height: 32px;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    color: #4a5568;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      border-color: #cbd5e0;
      background: #edf2f7;
    }
  }

  .reply-buttons {
    display: flex;
    gap: 12px;
  }

  .cancel-btn {
    padding: 8px 20px;
    background: transparent;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    color: #4a5568;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #cbd5e0;
      background: #edf2f7;
    }
  }

  .send-btn {
    padding: 8px 20px;
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
      transform: translateY(-1px);
    }
  }

  .no-message-selected {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
  }

  .no-message-content {
    text-align: center;

    i {
      font-size: 64px;
      color: #a0aec0;
      margin-bottom: 16px;
    }

    h3 {
      font-size: 20px;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 8px 0;
    }

    p {
      color: #718096;
      font-size: 14px;
    }
  }

  // 对话框样式
  .user-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;

    .option-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .option-info {
      display: flex;
      flex-direction: column;
    }

    .option-name {
      font-size: 14px;
      font-weight: 500;
      color: #2d3748;
    }

    .option-email {
      font-size: 12px;
      color: #718096;
    }
  }

  .upload-attachments {
    :deep(.el-upload) {
      width: 100%;
    }

    :deep(.el-upload-list__item) {
      margin-top: 8px;
    }
  }

  .upload-tip {
    font-size: 12px;
    color: #a0aec0;
    margin-top: 4px;
  }

  @media (max-width: 1024px) {
    .messages-container {
      flex-direction: column;
    }

    .messages-sidebar {
      flex: none;
      max-height: 400px;
    }

    .message-detail {
      min-height: 500px;
    }
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }

    .page-actions {
      width: 100%;
      flex-wrap: wrap;
    }

    .action-btn, .refresh-btn {
      flex: 1;
      min-width: 120px;
      justify-content: center;
    }

    .message-stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .message-header-detail {
      flex-direction: column;
      gap: 16px;
    }

    .message-title-detail {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }

    .reply-actions {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
    }

    .reply-tools, .reply-buttons {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .message-stats {
      grid-template-columns: 1fr;
    }

    .sender-detail {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
