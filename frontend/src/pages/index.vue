<script lang="ts" setup>
import DashboardDeckCard from '@/components/DashboardDeckCard.vue'

usePageStore().title = 'Home'

const decksStore = useDecksStore()
const { decks } = storeToRefs(decksStore)
const { getDecks } = decksStore

await getDecks()
</script>

<template>
  <div v-if="decks" class="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <DashboardDeckCard v-for="deck in decks" :key="deck.title" :deck />
  </div>
</template>

<style scoped></style>
