<script lang="ts" setup>
usePageStore().title = 'Practice'

const route = useRoute('/practice/[slug]')
const router = useRouter()

const decksStore = useDecksStore()
const { deck } = storeToRefs(decksStore)
const { getDeck } = decksStore

const practiceStore = usePracticeStore()
const { progress, finished, currentFlashcard } = storeToRefs(practiceStore)
const { startPractice, nextFlashcard, hideAnswers, restartPractice } = usePracticeStore()

const started = ref(false)
const answeredFlashcard = ref(false)
const answeredText = ref('')

watch(
  () => route.params.slug,
  async (slug: string) => {
    await getDeck(slug)
  },
  { immediate: true },
)

function onStartPractice() {
  startPractice()
  started.value = true
}

function onAnswerFlashcard(correct: boolean) {
  answeredFlashcard.value = true
  answeredText.value = `${correct ? 'Correct' : 'Incorrect'} Answer!`
}

function onNextQuestion() {
  answeredFlashcard.value = false
  answeredText.value = ''
  hideAnswers()

  nextFlashcard()
}

function onRestart() {
  restartPractice()
}

async function onGoHome() {
  await router.push('/')
}
</script>

<template>
  <div v-if="deck" class="mx-auto flex h-full max-w-2xl items-center justify-center">
    <div v-if="started">
      <div v-if="finished" class="flex flex-col items-center">
        <h2 class="text-xl">Finished!</h2>
        <div class="mt-4 space-x-4">
          <Button @click="onRestart">Practice Again</Button>
          <Button variant="outline" @click="onGoHome">Go Back Home</Button>
        </div>
      </div>

      <div v-else>
        <PracticeFlashcard
          v-if="currentFlashcard"
          :flashcard="currentFlashcard"
          :hide-answers="hideAnswers"
          @answer:flashcard="onAnswerFlashcard"
        />
        <div class="mt-6 flex items-center justify-between">
          <p>{{ answeredText || 'Click to answer the question!' }}</p>
          <Button :disabled="!answeredFlashcard" variant="outline" @click="onNextQuestion">
            Next Question
          </Button>
        </div>
        <Progress :model-value="progress" class="mt-6" />
      </div>
    </div>

    <Button v-else class="p-6 text-2xl" variant="outline" @click="onStartPractice">
      Start Practice
    </Button>
  </div>
</template>

<style scoped></style>
