<script lang="ts" setup>
const props = defineProps<{
  accept: string[]
  multiple: boolean
  maxFileSize: number
}>()

const emit = defineEmits<{
  'select:files': [files: File[]]
}>()

const dragging = ref(false)

const isAcceptedFileType = (file: File) => {
  if (!file.type && file.name.endsWith('.md')) {
    return true
  }

  return props.accept.includes(file.type)
}

const exceedsMaxFileSize = (file: File) => file.size > props.maxFileSize

const selectFiles = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!event.target || !target.files) {
    return
  }

  const selectedFiles = Array.from(target.files)

  console.log(selectedFiles)
  const filteredFiles = selectedFiles.filter((file: File) => {
    return isAcceptedFileType(file) && !exceedsMaxFileSize(file)
  })

  console.log(filteredFiles)

  emit('select:files', filteredFiles)
}
</script>

<template>
  <Card
    :class="{ 'bg-secondary': dragging }"
    class="relative gap-0 transition-colors duration-200"
    @dragenter="dragging = true"
    @dragleave="dragging = false"
    @dragover="dragging = true"
    @drop="dragging = false"
  >
    <CardContent class="flex flex-col items-center">
      <div
        class="bg-secondary text-secondary-foreground flex aspect-square size-10 items-center justify-center rounded-lg"
      >
        <i-lucide-upload class="text-2xl" />
      </div>

      <p class="mt-4 text-lg font-semibold">Upload files</p>

      <p class="text-muted-foreground mt-3 text-sm">Drag and drop or click to upload</p>
    </CardContent>
    <input
      :accept="accept.join(',')"
      :multiple
      class="absolute inset-0 cursor-pointer opacity-0"
      type="file"
      @change="selectFiles"
    />
  </Card>
</template>
