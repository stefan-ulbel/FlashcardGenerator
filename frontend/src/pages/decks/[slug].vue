<script lang="ts" setup>
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
      <Card v-for="flashcard in deck.flashcards" :key="flashcard.id">
        <CardHeader class="flex items-center space-x-2">
          <div
            class="bg-muted text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg text-2xl font-bold"
          >
            Q
          </div>
          <span class="text-lg font-semibold">{{ flashcard.question }}</span>
        </CardHeader>
        <Separator />

        <CardContent class="space-y-4">
          <p
            v-for="(answer, index) in flashcard.answers"
            :key="index"
            class="flex items-center space-x-3"
          >
            <span
              :class="[index + 1 === flashcard.correctAnswer ? 'bg-green-400' : 'bg-red-400']"
              class="text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-xl font-bold"
            >
              {{ index + 1 }}
            </span>
            <span :class="{ 'font-semibold': index + 1 === flashcard.correctAnswer }">
              {{ answer }}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  </section>
</template>

<style scoped></style>
