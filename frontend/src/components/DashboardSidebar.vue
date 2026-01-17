<script lang="ts" setup>
import IconLucideHouse from '~icons/lucide/house'
import IconLucideLayers from '~icons/lucide/layers'
import { useDecksStore } from '@/stores/loaders/decks.ts'

const { decks } = storeToRefs(useDecksStore())

const links = [
  {
    title: 'Home',
    path: '/',
    icon: IconLucideHouse,
  },
]

const menuLinks = [
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
            class="flex items-center justify-center space-x-2 rounded-lg"
            exact-active-class="bg-muted"
            to="/decks/create"
          >
            <SidebarMenuButton class="cursor-pointer" size="lg">
              <div
                class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
              >
                <i-lucide-layers-plus class="text-xl" />
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
                  class="text-muted-foreground"
                  exact-active-class="text-white bg-muted"
                >
                  <component :is="link.icon" />
                  <span>{{ link.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem v-for="link in menuLinks" :key="link.title">
              <SidebarMenuButton as-child>
                <RouterLink
                  :to="link.path"
                  class="text-muted-foreground"
                  exact-active-class="text-white bg-muted"
                >
                  <component :is="link.icon" />
                  <span>{{ link.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuItem v-for="deck in decks" :key="deck.title">
                  <SidebarMenuButton as-child>
                    <RouterLink
                      :to="`/decks/${deck.slug}`"
                      class="text-muted-foreground"
                      exact-active-class="text-white bg-muted"
                    >
                      <i-lucide-hexagon></i-lucide-hexagon>
                      <span>{{ deck.title }}</span>
                    </RouterLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

<style scoped></style>
