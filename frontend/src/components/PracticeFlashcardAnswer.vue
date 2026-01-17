<script lang="ts" setup>
const props = defineProps<{
  answer: string
  position: number
  correct: boolean
}>()

const emit = defineEmits<{
  'click:answer': [value: { position: number; correct: boolean }]
}>()

const { hidden } = storeToRefs(usePracticeStore())

const answerColor = computed(() => {
  if (hidden.value) {
    return 'bg-muted'
  }

  return props.correct ? 'bg-green-500' : 'bg-red-500'
})

const onClickAnswer = (position: number) => {
  if (!hidden.value) {
    return
  }

  emit('click:answer', { position, correct: props.correct })
}
</script>

<template>
  <p
    :class="{ 'hover:bg-muted': hidden, 'cursor-pointer': hidden }"
    class="flex items-center space-x-3 rounded-lg p-1"
    @click="onClickAnswer(position)"
  >
    <span
      :class="answerColor"
      class="flex aspect-square size-8 items-center justify-center rounded-lg text-xl font-bold"
    >
      {{ position }}
    </span>
    <span>
      {{ answer }}
    </span>
  </p>
</template>
