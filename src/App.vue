<template>
  <div id="app">
    <router-view/>
    <LearningAssistantFab />
  </div>
</template>

<script>
import LearningAssistantFab from '@/components/LearningAssistantFab.vue'

export default {
  name: 'App',
  components: {
    LearningAssistantFab
  }
}
</script>
