<template>
  <div :style="style">
    <div>{{ uuid }}</div>
    <button @click="handleClick">获取设备信息</button>
    <div v-if="loading">获取中...</div>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties, onMounted, ref } from 'vue';
const uuid = ref('')
const style: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '10px'
}
const loading = ref(false)
onMounted(async () => {
  uuid.value = await window.electron.ipcRenderer.invoke('getUUID')
  console.log(uuid.value)
})

async function handleClick() {
  loading.value = true
  try {
    const res = await window.electron.ipcRenderer.invoke('getSystemInfo')
    download(JSON.stringify(res))
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
function download(text: string) {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'device.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url);

}
</script>

<style scoped></style>
