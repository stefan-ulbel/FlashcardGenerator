<script lang="ts" setup>
const props = defineProps<{
  file: File
}>()

const emit = defineEmits<{
  'delete:file': [value: File]
}>()

const onClickDelete = () => {
  emit('delete:file', props.file)
}
</script>

<template>
  <div>
    <Card class="py-4">
      <CardContent class="flex items-center justify-between px-4">
        <div class="flex items-center gap-4">
          <i-lucide-file class="text-muted-foreground" />
          {{ file.name }}
        </div>

        <i-lucide-x
          class="cursor-pointer transition-colors duration-100 hover:text-red-500"
          @click="onClickDelete"
        />
      </CardContent>
    </Card>
  </div>
</template>
