import type { Deck } from '@/types/deck.ts'
import { useMemoize } from '@vueuse/core'
import { deckQuery, decksQuery } from '@/lib/api/mock-decks.ts'

export const useDecksStore = defineStore('decks', () => {
  const decks = ref<Deck[] | null>(null)
  const deck = ref<Deck | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadDecks = useMemoize(async (_key: string) => await decksQuery())
  const loadDeck = useMemoize(async (slug: string) => await deckQuery(slug))

  const getDecks = async () => {
    decks.value = null

    decks.value = await loadDecks('decks')
  }

  const getDeck = async (slug: string) => {
    deck.value = null

    deck.value = await loadDeck(slug)
  }

  return { decks, deck, getDecks, getDeck }
})
