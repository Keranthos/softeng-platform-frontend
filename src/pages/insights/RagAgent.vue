<template>
  <div class="rag-page">
    <header class="head">
      <div>
        <h1>RAG 学习助手</h1>
        <p class="sub">
          先从平台库检索工具 / 课程 / 项目片段，再生成回答；未配置大模型密钥时为离线演示模式。
        </p>
      </div>
      <div class="actions">
        <el-button @click="$router.push('/home')">主页</el-button>
      </div>
    </header>

    <el-card class="chat-card" shadow="hover">
      <template #header>
        <span>对话</span>
        <el-tag v-if="lastMode" size="small" :type="isLlmMode(lastMode) ? 'success' : 'info'" class="mode-tag">
          {{ modeLabel(lastMode) }}
        </el-tag>
        <span v-if="lastModel" class="model-hint">{{ lastModel }}</span>
      </template>

      <div class="thread">
        <div v-for="(m, i) in messages" :key="i" :class="['bubble', m.role]">
          <div class="role-label">{{ m.role === 'user' ? '我' : '助手' }}</div>
          <div class="text">{{ m.text }}</div>
        </div>
        <p v-if="!messages.length" class="muted">试试问：与某门课、某种工具或实训项目相关的问题。</p>
      </div>

      <div class="composer">
        <el-input
          v-model="input"
          type="textarea"
          :rows="3"
          placeholder="输入你的问题…"
          maxlength="800"
          show-word-limit
          @keydown.enter.exact.prevent="send"
        />
        <div class="row">
          <el-button type="primary" :loading="loading" @click="send">发送</el-button>
          <el-button :disabled="loading" @click="clear">清空对话</el-button>
        </div>
      </div>
    </el-card>

    <el-card v-if="sources.length" class="sources-card" shadow="never">
      <template #header>本次检索引用（RAG 溯源）</template>
      <ul class="sources">
        <li v-for="(s, i) in sources" :key="i">
          <el-tag size="small">{{ s.kind }}</el-tag>
          <router-link v-if="linkFor(s)" class="title-link" :to="linkFor(s)">{{ s.title }}</router-link>
          <span v-else class="title-plain">{{ s.title }}</span>
          <p class="snippet">{{ s.snippet }}</p>
        </li>
      </ul>
    </el-card>

    <el-card class="hint-card" shadow="never">
      <template #header>说明</template>
      <p class="muted">
        后端环境变量（与 blog/agent 对齐优先）：<code>GOOGLE_API_KEY</code> 或 <code>GEMINI_API_KEY</code>、
        <code>GEMINI_API_BASE</code>（默认 Google 官方）、<code>GEMINI_CHAT_MODEL</code>（如 <code>gemini-2.5-flash</code>）、<code>GEMINI_TEMPERATURE</code>；
        自定义反代时需 <code>GEMINI_PROXY_TOKEN</code>。未配置 Gemini 时可选用 <code>OPENAI_API_KEY</code> 等 OpenAI 兼容网关。
        皆空时仍为离线演示流程。
      </p>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { HttpManager } from '@/api'

const input = ref('')
const loading = ref(false)
const messages = ref([])
const sources = ref([])
const lastMode = ref('')
const lastModel = ref('')

function isLlmMode (m) {
  return m === 'llm' || m === 'gemini'
}

function modeLabel (m) {
  if (m === 'gemini') return 'Gemini 生成'
  if (m === 'llm') return 'LLM 生成'
  return '离线演示'
}

function linkFor (s) {
  if (s.kind === 'tool') return `/tools/detail/${s.id}`
  if (s.kind === 'course') return `/course/detail/${s.id}`
  if (s.kind === 'project') return `/projects/detail/${s.id}`
  return ''
}

async function send () {
  const q = input.value.trim()
  if (!q) {
    ElMessage.warning('请输入问题')
    return
  }
  loading.value = true
  messages.value.push({ role: 'user', text: q })
  input.value = ''
  try {
    const data = await HttpManager.ragAgentChat(q)
    lastMode.value = data.mode || ''
    lastModel.value = data.model || ''
    sources.value = Array.isArray(data.sources) ? data.sources : []
    messages.value.push({ role: 'assistant', text: data.answer || '（无回答内容）' })
  } catch (e) {
    const msg = e?.response?.data?.message || e?.message || '请求失败'
    messages.value.push({ role: 'assistant', text: `出错：${msg}` })
    ElMessage.error(typeof msg === 'string' ? msg : '请求失败')
  } finally {
    loading.value = false
  }
}

function clear () {
  messages.value = []
  sources.value = []
  lastMode.value = ''
  lastModel.value = ''
}
</script>

<style scoped>
.rag-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}
.head h1 {
  margin: 0 0 6px;
  font-size: 1.5rem;
}
.sub {
  margin: 0;
  color: #606266;
  font-size: 0.9rem;
  line-height: 1.5;
}
.actions {
  flex-shrink: 0;
}
.chat-card {
  margin-bottom: 16px;
}
.mode-tag {
  margin-left: 10px;
  vertical-align: middle;
}
.model-hint {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}
.thread {
  min-height: 120px;
  max-height: 420px;
  overflow-y: auto;
  margin-bottom: 16px;
}
.bubble {
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  line-height: 1.55;
}
.bubble.user {
  background: #ecf5ff;
  border: 1px solid #d9ecff;
}
.bubble.assistant {
  background: #f4f4f5;
  border: 1px solid #e4e7ed;
}
.role-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}
.text {
  white-space: pre-wrap;
  word-break: break-word;
}
.composer .row {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
.muted {
  color: #909399;
  font-size: 13px;
  margin: 0;
}
.sources-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sources li {
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
}
.sources li:last-child {
  border-bottom: none;
}
.title-link,
.title-plain {
  margin-left: 8px;
  font-weight: 500;
}
.title-link {
  color: #409eff;
  text-decoration: none;
}
.title-link:hover {
  text-decoration: underline;
}
.snippet {
  margin: 6px 0 0;
  font-size: 13px;
  color: #606266;
}
.hint-card code {
  font-size: 12px;
  background: #f5f7fa;
  padding: 1px 6px;
  border-radius: 4px;
}
</style>
