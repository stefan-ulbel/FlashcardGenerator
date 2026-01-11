<script setup lang="ts">
import IconLucideHouse from '~icons/lucide/house'
import IconLucideLayers from '~icons/lucide/layers'

const links = [
  {
    title: 'Home',
    path: '/',
    icon: IconLucideHouse,
  },
  {
    title: 'Decks',
    path: '/decks',
    icon: IconLucideLayers,
  },
]
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <RouterLink
            to="/decks/create"
            class="flex items-center justify-center space-x-2 rounded-lg"
            exact-active-class="bg-muted"
          >
            <SidebarMenuButton size="lg">
              <div
                class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
              >
                <i-lucide-circle-plus class="text-xl" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-semibold">Create Deck</span>
              </div>
            </SidebarMenuButton>
          </RouterLink>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="link in links" :key="link.title">
              <SidebarMenuButton as-child>
                <RouterLink
                  :to="link.path"
                  exact-active-class="text-white bg-muted"
                  class="text-muted-foreground"
                >
                  <component :is="link.icon" />
                  <span>{{ link.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

<style scoped></style>
