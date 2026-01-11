import type { ColumnDef } from '@tanstack/vue-table'
import type { Deck } from '@/types/deck.ts'
import { RouterLink } from 'vue-router'

export const columns: ColumnDef<Deck>[] = [
  {
    accessorKey: 'title',
    header: () => h('div', { class: 'text-left' }, 'Title'),
    cell: ({ row }) =>
      h(
        RouterLink,
        {
          to: `/decks/${row.original.id}`,
          class: 'text-left font-medium hover:bg-muted block w-full',
        },
        () => row.getValue('title'),
      ),
  },

  {
    accessorKey: 'tags',
    header: () => h('div', { class: 'text-left' }, 'Tags'),
    cell: ({ row }) => h('div', { class: 'text-left font-medium' }, row.original.tags.join(', ')),
  },

  {
    accessorKey: 'last_learned_at',
    header: () => h('div', { class: 'text-left' }, 'Last Learned'),
    cell: ({ row }) =>
      h('div', { class: 'text-left font-medium' }, row.getValue('last_learned_at')),
  },

  {
    accessorKey: 'flashcards',
    header: () => h('div', { class: 'text-left' }, 'Flashcards'),
    cell: ({ row }) =>
      h('div', { class: 'text-right font-medium' }, row.original.flashcards.length.toString()),
  },
]
