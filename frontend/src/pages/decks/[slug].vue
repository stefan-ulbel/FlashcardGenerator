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
  <div></div>
</template>

<style scoped></style>
