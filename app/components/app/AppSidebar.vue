<script setup lang="ts">
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

// Menu items.
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
</script>

<template>
	<Sidebar variant="floating" collapsible="icon">
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem v-for="item in items" :key="item.title">
							<SidebarMenuButton as-child>
								<NuxtLink class="flex items-center cursor-pointer">
									<Icon :name="item.icon" style="width: 20px; height: 20px;" />
									<span>{{ item.title }}</span>
								</NuxtLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	</Sidebar>
</template>

<style scoped>

</style>
