export const usePageStore = defineStore('page', () => {
  const title = ref('')

  return {
    title,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
}
