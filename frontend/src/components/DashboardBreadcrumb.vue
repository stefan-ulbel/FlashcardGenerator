<script setup lang="ts">
const route = useRoute()

const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter((path) => path !== '')

  return pathArray.map((path, index) => {
    const url = '/' + pathArray.slice(0, index + 1).join('/')

    const label = path.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())

    return {
      label,
      url,
      active: index === pathArray.length - 1,
    }
  })
})
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink>
          <RouterLink to="/" exact-active-class="text-foreground underline">Home</RouterLink>
        </BreadcrumbLink>
      </BreadcrumbItem>

      <template v-for="breadcrumb in breadcrumbs" :key="breadcrumb.label">
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>
            <RouterLink :to="breadcrumb.url" exact-active-class="text-foreground underline">{{
              breadcrumb.label
            }}</RouterLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>

<style scoped></style>
