<script lang="ts" setup>
import { columns } from '@/lib/table-columns/decks-columns.ts'

usePageStore().title = 'Decks'

const decksStore = useDecksStore()

const { decks } = storeToRefs(decksStore)
const { getDecks } = useDecksStore()

await getDecks()
</script>

<template>
  <div class="flex flex-1 flex-col">
    <DataTable v-if="decks" :columns="columns" :data="decks" class="mt-12" />
  </div>
</template>

<style scoped></style>
