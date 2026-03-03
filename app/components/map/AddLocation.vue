<script setup lang="ts">
import type { LngLat } from '@yandex/ymaps3-types';

import AddLocationForm from '~/components/form/AddLocationForm.vue';

interface Props {
	coordinates: LngLat | null;
	onSubmit: (data: any) => Promise<void>;
}

const props = defineProps<Props>();
</script>

<template>
	<div class="flex flex-col gap-4 p-3">
		<h2 class="text-xl font-bold">
			Добавить локацию
		</h2>
		<AddLocationForm :coordinates="props.coordinates" :on-submit="props.onSubmit" />
	</div>
</template>
