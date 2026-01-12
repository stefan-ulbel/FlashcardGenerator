<script lang="ts" setup>
import AppFileUploadPreviewList from '@/components/AppFileUploadPreviewList.vue'

const MAX_FILE_MB = 10

const props = withDefaults(
  defineProps<{
    accept?: string[]
    multiple?: boolean
    maxFileSize?: number
  }>(),
  {
    accept: () => ['application/pdf', 'text/plain', '.md'],
    multiple: false,
    maxFileSize: MAX_FILE_MB * 1_024 * 1_024,
  },
)

const files = ref<File[]>([])

const onSelectFiles = (selectedFiles: File[]) => {
  if (props.multiple) {
    files.value = files.value.concat(selectedFiles)
  } else {
    files.value = [selectedFiles[0] as File]
  }
}

const onDeleteFile = (fileToDelete: File) => {
  files.value = files.value.filter((file: File) => file !== fileToDelete)
}

const upload = async () => {
  if (!files.value.length) {
    return
  }

  const formData = new FormData()

  for (const file of files.value) {
    formData.append(file.name, file)
  }

  const response = await fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await response.text()

  console.log(data)
}
</script>

<template>
  <div>
    <AppFileUploadDropZone :accept :max-file-size :multiple @select:files="onSelectFiles" />
    <p class="text-muted-foreground mt-4 px-4 text-sm">
      The maximum file size is {{ MAX_FILE_MB }} mb
    </p>

    <Separator class="mt-4 mb-8" />

    <AppFileUploadPreviewList :files="files" @delete:file="onDeleteFile" />
  </div>

  <Button class="mt-4" @click="upload">Create Deck</Button>
</template>
