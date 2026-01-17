export const usePracticeStore = defineStore('practice', () => {
  const { deck } = storeToRefs(useDecksStore())

  const shuffledIds = ref<number[]>([])
  const currentIndex = ref(0)
  const finished = ref(false)
  const _hidden = ref(true)
  const _correctAnswers = ref(0)

  const hidden = computed(() => _hidden.value)

  const correctAnswers = computed(() => _correctAnswers.value)

  const flashcards = computed(() => deck.value?.flashcards ?? [])

  const totalFlashcards = computed(() => flashcards.value.length)

  const currentFlashcard = computed(() => {
    const id = shuffledIds.value[currentIndex.value]
    return flashcards.value.find((flashcard) => flashcard.id === id)
  })

  const progress = computed(() => {
    if (!flashcards.value.length) {
      return 0
    }

    return (currentIndex.value / shuffledIds.value.length) * 100
  })

  function startPractice() {
    if (!flashcards.value.length) {
      return
    }

    shuffledIds.value = flashcards.value.map((card) => card.id).sort(() => Math.random() - 0.5)

    currentIndex.value = 0
    finished.value = false
    _correctAnswers.value = 0
  }

  function restartPractice() {
    startPractice()
  }

  function nextFlashcard() {
    if (currentIndex.value >= shuffledIds.value.length - 1) {
      finished.value = true
      return
    }

    currentIndex.value++
  }

  function hideAnswers() {
    _hidden.value = true
  }

  function showAnswers() {
    _hidden.value = false
  }

  function incrementCorrectAnswers() {
    _correctAnswers.value++
  }

  return {
    shuffledIds,
    currentIndex,
    finished,
    currentFlashcard,
    progress,
    startPractice,
    restartPractice,
    nextFlashcard,
    hidden,
    hideAnswers,
    showAnswers,
    correctAnswers,
    incrementCorrectAnswers,
    totalFlashcards,
  }
})
