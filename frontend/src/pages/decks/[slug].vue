<script lang="ts" setup>
import FlashcardExpanded from '@/components/FlashcardExpanded.vue'
import type { Flashcard } from '@/types/flashcard.ts'

const route = useRoute('/decks/[slug]')
const router = useRouter()

const decksStore = useDecksStore()
const { deck } = storeToRefs(decksStore)
const { getDeck, deleteDeck } = decksStore

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

const onClickDelete = async () => {
  await deleteDeck(deck.value!.slug)
  await router.push('/decks')
}

const onUpdateFlashcard = (flashcard: Flashcard) => {
  alert(`Updating flashcard ${flashcard.id}`)
}

const onDeleteFlashcard = (flashcard: Flashcard) => {
  alert(`Deleting flashcard ${flashcard.id}`)
}
</script>

<template>
  <section v-if="deck">
    <div class="flex w-full justify-end space-x-3">
      <Button>Edit Deck</Button>
      <Button class="bg-red-500 hover:bg-red-600" @click="onClickDelete">Delete Deck</Button>
    </div>

    <h2 class="mt-6 text-3xl">Flashcards</h2>

    <div class="class mt-6 grid gap-6 lg:grid-cols-2">
      <FlashcardExpanded
        v-for="flashcard in deck.flashcards"
        :key="flashcard.id"
        :flashcard
        @update:flashcard="onUpdateFlashcard"
        @delete:flashcard="onDeleteFlashcard"
      />
    </div>
  </section>
</template>

<style scoped></style>
