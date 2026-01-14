<script lang="ts" setup>
import { columns } from '@/lib/table-columns/decks-columns.ts'
import { useDeckStore } from '@/stores/deck.ts'

const { decks } = storeToRefs(useDeckStore())
</script>

<template>
  <div class="flex flex-1 flex-col">
    <h1 class="text-4xl">Decks</h1>
    <DataTable :columns="columns" :data="decks" class="mt-12" />
  </div>
</template>

<style scoped></style>
