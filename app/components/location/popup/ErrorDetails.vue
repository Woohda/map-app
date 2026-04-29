<script setup lang="ts">
import { usePopupStore } from '~stores/popup';

const popupStore = usePopupStore();
</script>

<template>
	<div
		v-if="popupStore.popup.type === 'errorInfo' && popupStore.popup.data"
		class="flex flex-col gap-1 items-center p-2"
	>
		<span class="text-lg font-semibold text-destructive self-start">
			<Icon name="tabler:alert-triangle" size="24" class="align-text-top" />
			Ошибка геолокации
		</span>
		<p class="text-sm text-muted-foreground">
			{{ String(popupStore.popup.data) }}
		</p>
	</div>
</template>

<style scoped></style>
