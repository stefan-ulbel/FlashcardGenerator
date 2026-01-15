<script lang="ts" setup>
import FlashcardExpanded from '@/components/FlashcardExpanded.vue'

const route = useRoute('/decks/[slug]')

const decksStore = useDecksStore()
const { deck } = storeToRefs(decksStore)
const { getDeck } = decksStore

watch(
  () => route.params.slug,
  async (slug: string) => {
    await getDeck(slug)
  },
  { immediate: true },
)

watch(
  () => deck.value?.title,
  () => {
    usePageStore().title = deck.value?.title ?? ''
  },
  { immediate: true },
)
</script>

<template>
  <section v-if="deck">
    <h2 class="text-3xl">Flashcards</h2>

    <div class="class mt-6 grid gap-6 lg:grid-cols-2">
      <FlashcardExpanded v-for="flashcard in deck.flashcards" :key="flashcard.id" :flashcard />
    </div>
  </section>
</template>

<style scoped></style>
