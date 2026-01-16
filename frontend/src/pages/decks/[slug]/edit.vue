<script lang="ts" setup>
import { useForm } from '@tanstack/vue-form'
import { z } from 'zod'
import type { UpdateDeck } from '@/types/deck.ts'

const route = useRoute('/decks/[slug]/edit')
const router = useRouter()

const decksStore = useDecksStore()
const { deck } = storeToRefs(decksStore)
const { getDeck, updateDeck } = decksStore

const newDeck = ref<Partial<UpdateDeck> | null>(null)

watch(
  () => route.params.slug,
  async (slug: string) => {
    await getDeck(slug)
    newDeck.value = {
      id: deck.value?.id,
      title: deck.value?.title,
    }
  },
  { immediate: true },
)

watch(
  () => deck.value?.title,
  () => {
    usePageStore().title = `Edit - ${deck.value?.title ?? ''}`
  },
  { immediate: true },
)

const formSchema = z.object({
  title: z
    .string()
    .min(3, 'Deck title must be at least 3 characters.')
    .max(64, 'Deck title must be at most 64 characters.'),
})

// TODO(raoul): I'm getting some type errors, don't exactly know why.
const form = useForm({
  defaultValues: deck.value,
  validators: {
    onSubmit: formSchema,
  },
  onSubmit: async ({ value }) => {
    submit(value)
  },
})

const isInvalid = (field: any) => {
  return field.state.meta.isTouched && !field.state.meta.isValid
}

const submit = async ({ title }: { title: string }) => {
  await updateDeck({ id: deck.value!.id, title })
  await router.push(`/decks/${deck.value!.slug}`)
}

const cancel = async () => {
  await router.push(`/decks/${deck.value!.slug}`)
}
</script>

<template>
  <section v-if="deck">
    <form @submit.prevent="form.handleSubmit">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>General Information</FieldLegend>
          <form.Field #default="{ field }" name="title">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel :for="field.name">Title</FieldLabel>
              <Input
                :id="field.name"
                :aria-invalid="isInvalid(field)"
                :default-value="deck?.title ?? ''"
                :model-value="field.state.value"
                placeholder="Generative AI"
                required
                @blur="field.handleBlur"
                @input="field.handleChange($event.target.value)"
              />
              <FieldDescription>Choose a unique title for your deck.</FieldDescription>
              <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
            </Field>
          </form.Field>
        </FieldSet>

        <Field orientation="horizontal">
          <Button type="submit">Submit</Button>
          <Button variant="outline" @click="cancel">Cancel</Button>
        </Field>
      </FieldGroup>
    </form>
  </section>
</template>

<style scoped></style>
