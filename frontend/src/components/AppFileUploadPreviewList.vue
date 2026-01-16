<script lang="ts" setup>
import AppFileUploadPreviewListItem from '@/components/AppFileUploadPreviewListItem.vue'

defineProps<{
  files: File[]
}>()
</script>

<template>
  <div class="mt-4 space-y-6">
    <template v-if="files.length">
      <AppFileUploadPreviewListItem
        v-for="file in files"
        :key="file.name"
        :file="file"
        @delete:file="$emit('delete:file', file)"
      />
    </template>
    <div v-else class="flex items-center justify-center">No files uploaded.</div>
  </div>
</template>
