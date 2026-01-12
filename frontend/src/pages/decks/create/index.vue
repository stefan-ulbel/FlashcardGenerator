<script setup lang="ts">
const files = ref<File[]>([])

const MAX_FILE_MB = 10
const MAX_FILE_BYTES = MAX_FILE_MB * 1_024 * 1_024

const allowedFileTypes = ['application/pdf', 'text/plain', '.md']

const fileTooLarge = (file: File) => file.size > MAX_FILE_BYTES

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!event.target || !target.files) {
    return
  }

  const filesArray = Array.from(target.files)

  files.value = files.value.concat(filesArray)
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
  <h1 class="text-4xl">Create Deck</h1>

  <label class="mt-6">
    <Card class="hover:bg-secondary cursor-pointer gap-0 transition-colors duration-200">
      <CardContent class="flex flex-col items-center">
        <div
          class="bg-secondary text-secondary-foreground flex aspect-square size-10 items-center justify-center rounded-lg"
        >
          <i-lucide-upload class="text-2xl" />
        </div>

        <p class="mt-4 text-lg font-semibold">Upload files</p>

        <p class="text-muted-foreground mt-3 text-sm">Drag and drop or click to upload</p>
      </CardContent>
    </Card>
    <input
      type="file"
      multiple
      @change="handleFileSelect"
      hidden
      :accept="allowedFileTypes.join(',')"
    />
  </label>

  <div class="mt-6 space-y-6">
    <div v-for="file in files" :key="file.name">
      {{ file.name }}
      <span v-if="fileTooLarge(file)" class="text-sm text-red-500"
        >File must be no larger than {{ MAX_FILE_MB }} mb.</span
      >
    </div>
  </div>

  <Button @click="upload">Create Deck</Button>
</template>

<style scoped></style>
