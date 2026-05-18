<template>
  <div class="path-wrap">
    <h3 class="path-title">
      <span class="bar" />
      学习路径与里程碑
    </h3>
    <p class="path-desc">
      按课程生成的<strong>静态</strong>教学周次示意（哈希分班），用于报告中的「学习路径 / 甘特轻量版」说明。
    </p>
    <div class="gantt-row">
      <div
        v-for="(w, i) in weeks"
        :key="i"
        class="gantt-cell"
        :style="{ flex: w.weight }"
      >
        <span class="wk-label">{{ w.label }}</span>
      </div>
    </div>
    <el-timeline class="mt-4">
      <el-timeline-item
        v-for="(m, idx) in milestones"
        :key="idx"
        :timestamp="m.time"
        placement="top"
        :type="m.type"
        :hollow="idx > activeIdx"
      >
        <h4 class="m-title">{{ m.title }}</h4>
        <p class="m-body">{{ m.body }}</p>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  courseId: { type: String, default: '' },
  courseTitle: { type: String, default: '' }
})

function hashSeed (s) {
  let h = 0
  const str = String(s || '0')
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

const activeIdx = computed(() => hashSeed(props.courseId) % 4)

const weeks = computed(() => {
  const seed = hashSeed(props.courseId)
  const base = [
    { label: 'W1–2 导论', weight: 1 },
    { label: 'W3–5 需求', weight: 1.2 },
    { label: 'W6–8 设计', weight: 1.1 },
    { label: 'W9–12 实现', weight: 1.4 },
    { label: 'W13–16 测试', weight: 1 },
    { label: 'W17 交付', weight: 0.8 }
  ]
  if (seed % 2 === 1) {
    base[2].label = 'W6–8 架构'
  }
  return base
})

const milestones = computed(() => {
  const t = props.courseTitle || '本课程'
  return [
    { time: '第 2 周', title: '软件过程与敏捷', body: `在「${t}」中建立过程观：迭代、持续集成概念预习。`, type: 'primary' },
    { time: '第 5 周', title: '需求工程', body: '用例、用户故事与验收标准；与后续设计衔接。', type: 'success' },
    { time: '第 9 周', title: '设计原则', body: 'SOLID、模块边界；可结合平台项目案例自学。', type: 'warning' },
    { time: '第 14 周', title: '测试与质量', body: '单元测试、静态分析工具链（可链至本站工具区）。', type: 'danger' },
    { time: '第 17 周', title: '里程碑答辩', body: '交付物检查、文档与演示视频。', type: 'info' }
  ]
})
</script>

<style scoped>
.path-wrap {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e5e7eb;
}
.path-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 0.35rem;
}
.bar {
  width: 4px;
  height: 1rem;
  border-radius: 2px;
  background: linear-gradient(180deg, #3b82f6, #8b5cf6);
}
.path-desc {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 1rem;
  line-height: 1.5;
}
.gantt-row {
  display: flex;
  gap: 4px;
  height: 28px;
  border-radius: 8px;
  overflow: hidden;
}
.gantt-cell {
  background: linear-gradient(90deg, #dbeafe, #e0e7ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #1e3a8a;
  font-weight: 600;
}
.wk-label {
  padding: 0 4px;
  text-align: center;
  line-height: 1.1;
}
.m-title {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}
.m-body {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.45;
}
</style>
