<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  code: string
}>()

const svg = ref('')
const error = ref('')

async function renderDiagram() {
  try {
    const decoded = decodeURIComponent(props.code)
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    })
    const id = 'mermaid-' + Math.random().toString(36).slice(2, 10)
    const { svg: rendered } = await mermaid.render(id, decoded)
    svg.value = rendered
    error.value = ''
  } catch (err: any) {
    error.value = err?.message || String(err)
  }
}

onMounted(renderDiagram)
watch(() => props.code, renderDiagram)
</script>

<template>
  <div class="mermaid">
    <div v-if="svg" v-html="svg" />
    <pre v-else-if="error" style="color: #dc2626; font-size: 0.85rem;">{{ error }}</pre>
    <div v-else style="color: #64748b; font-size: 0.85rem;">Đang tải biểu đồ...</div>
  </div>
</template>
