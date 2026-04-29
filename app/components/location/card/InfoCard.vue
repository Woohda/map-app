<script setup lang="ts"></script>

<template>
	<div
		class="flex flex-col gap-1 pointer-events-auto rounded-xl border bg-background/70 p-4 shadow-lg backdrop-blur-sm"
	>
		<h3 class="flex items-center gap-1 font-bold">
			<Icon name="tabler:map-pin" size="25" class="text-primary" />
			Карта объектов
		</h3>
		<p class="text-xs text-muted-foreground">
			Нажмите на маркер для деталей.
		</p>
		<p class="text-xs text-muted-foreground">
			Двойное нажатие для добавления новой локации.
		</p>
	</div>
</template>

<style scoped></style>
