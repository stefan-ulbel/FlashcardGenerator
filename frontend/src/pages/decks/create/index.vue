<script lang="ts" setup>
import { z } from 'zod'
import { useForm } from '@tanstack/vue-form'

usePageStore().title = 'Create Deck'

const router = useRouter()

const { createDeck } = useDecksStore()

const files = ref<File[]>([])

const formSchema = z.object({
  title: z
    .string()
    .min(3, 'Deck title must be at least 3 characters.')
    .max(64, 'Deck title must be at most 64 characters.'),
  topic: z
    .string()
    .min(3, 'Deck topic must be at least 3 characters.')
    .max(64, 'Deck topic must be at most 64 characters.'),
})

const form = useForm({
  defaultValues: {
    title: '',
    topic: '',
  },
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

const onUpdateFiles = (updatedFiles: File[]) => {
  files.value = updatedFiles
}

const submit = async ({ title, topic }: { title: string; topic: string }) => {
  if (!files.value.length) {
    return
  }

  const formData = new FormData()

  formData.append('title', title)
  formData.append('topic', topic)
  for (const file of files.value) {
    formData.append(file.name, file)
  }

  await createDeck(formData)
  await router.push('/decks')
}
</script>

<template>
  <div class="w-full max-w-xl">
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
                :model-value="field.state.value"
                placeholder="My Lovely Deck"
                required
                @blur="field.handleBlur"
                @input="field.handleChange($event.target.value)"
              />
              <FieldDescription>Choose a unique title for your deck.</FieldDescription>
              <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
            </Field>
          </form.Field>
          <form.Field #default="{ field }" name="topic">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel :for="field.name">Topic</FieldLabel>
              <Input
                :id="field.name"
                :aria-invalid="isInvalid(field)"
                :model-value="field.state.value"
                placeholder="Generative AI"
                required
                @blur="field.handleBlur"
                @input="field.handleChange($event.target.value)"
              />
              <FieldDescription>
                Describe the topic for which the flashcards should be generated.
              </FieldDescription>
              <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
            </Field>
          </form.Field>
        </FieldSet>
        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Files</FieldLegend>
          <FieldDescription>
            The uploaded files are used to generate your flashcards.
          </FieldDescription>

          <Field>
            <FieldLabel for="file">File Upload</FieldLabel>
            <AppFileUpload :multiple="true" @update:files="onUpdateFiles" />
          </Field>
        </FieldSet>

        <Field orientation="horizontal">
          <Button type="submit"> Submit </Button>
        </Field>
      </FieldGroup>
    </form>
  </div>
</template>

<style scoped></style>
