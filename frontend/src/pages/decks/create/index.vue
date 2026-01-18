<script lang="ts" setup>
import { z } from 'zod'
import { useForm } from '@tanstack/vue-form'

usePageStore().title = 'Create Deck'

const router = useRouter()

const { createDeck } = useDecksStore()

const files = ref<File[]>([])
const loading = ref(false)

const formSchema = z.object({
  title: z
    .string()
    .min(3, 'Deck title must be at least 3 characters.')
    .max(64, 'Deck title must be at most 64 characters.'),
})

const form = useForm({
  defaultValues: {
    title: '',
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

const submit = async ({ title }: { title: string }) => {
  if (!files.value.length) {
    return
  }

  const formData = new FormData()

  formData.append('title', title)
  for (const file of files.value) {
    formData.append(file.name, file)
  }

  loading.value = true

  try {
    await createDeck(formData)
    await router.push('/decks')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
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
          <Button :disabled="loading" type="submit">
            <i-lucide-loader-circle v-if="loading" class="animate-spin" />
            <i-lucide-brain v-else />
            Submit
          </Button>
        </Field>
      </FieldGroup>
    </form>
  </div>
</template>

<style scoped></style>
