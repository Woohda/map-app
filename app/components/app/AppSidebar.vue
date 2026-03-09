<script setup lang="ts">
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';

const items = [
	{
		title: 'Локации',
		url: '#',
		icon: 'tabler:map',
	},
	{
		title: 'Добавить локацию',
		url: '#',
		icon: 'tabler:map-pin',
	},
];
const route = useRoute();
const { isMobile } = useSidebar();
</script>

<template>
	<Sidebar v-if="['/'].includes(route.path) || (isMobile && ['/profile'].includes(route.path))" variant="floating" collapsible="icon">
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem v-for="item in items" :key="item.title">
							<SidebarMenuButton as-child size="lg">
								<NuxtLink class="flex items-center cursor-pointer">
									<Icon :name="item.icon" size="23" class="shrink-0" />
									<span
										class="flex items-center transition-[width,opacity,margin] duration-300 ease-linear group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0 w-full opacity-100 ml-2 overflow-hidden whitespace-nowrap"
									>
										{{ item.title }}
									</span>
								</NuxtLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	</Sidebar>
</template>

<style scoped></style>
