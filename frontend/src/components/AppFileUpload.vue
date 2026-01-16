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

const emit = defineEmits<{
  'update:files': [value: File[]]
}>()

const files = ref<File[]>([])

const onSelectFiles = (selectedFiles: File[]) => {
  if (props.multiple) {
    files.value = files.value.concat(selectedFiles)
  } else {
    files.value = [selectedFiles[0] as File]
  }

  emit('update:files', files.value)
}

const onDeleteFile = (fileToDelete: File) => {
  files.value = files.value.filter((file: File) => file !== fileToDelete)
  emit('update:files', files.value)
}
</script>

<template>
  <div>
    <AppFileUploadDropZone :accept :max-file-size :multiple @select:files="onSelectFiles" />
    <p class="text-muted-foreground mt-4 text-sm">
      Allowed files are <span class="bg-muted text-muted-foreground rounded-sm p-1">pdf</span>,
      <span class="bg-muted text-muted-foreground rounded-sm p-1">md</span>,
      <span class="bg-muted text-muted-foreground rounded-sm p-1">txt</span>
      (max {{ MAX_FILE_MB }} mb)
    </p>

    <Separator class="mt-4 mb-8" />

    <AppFileUploadPreviewList :files="files" @delete:file="onDeleteFile" />
  </div>

  <!--  <Button class="mt-4" @click="upload">Create Deck</Button>-->
</template>
