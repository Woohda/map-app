<script setup lang="ts">
import Map from '~/components/location/map/Map.vue';

useSeo({
	title: 'Карта локаций - Map App',
	description: 'Исследуйте карту локаций, добавляйте свои места и делитесь ими с другими пользователями. Найдите интересные места рядом с вами.',
	type: 'website',
});
</script>

<template>
	<div class="h-screen w-full">
		<Map />
	</div>
</template>

<style scoped></style>
