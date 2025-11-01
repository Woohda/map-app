<script
    setup
    lang="ts"
>
const colorMode = useColorMode();
const isReady = ref(false); // локальный флаг для готовности клиента

onMounted(() => {
	const mq = window.matchMedia('(prefers-color-scheme: dark)');
	const updateSystemTheme = () => {
		if (colorMode.preference === 'system') {
			colorMode.value = mq.matches ? 'dark' : 'light';
		}
	};
	mq.addEventListener('change', updateSystemTheme);
	updateSystemTheme();
	isReady.value = true;
});
const isTheme = computed({
	get: () => colorMode.value === 'dark',
	set: (value) => {
		colorMode.preference = value ? 'dark' : 'light';
		colorMode.value = value ? 'dark' : 'light';
	},
});
</script>

<template>
	<Toggle
		v-if="isReady"
		v-model="isTheme"
		label="Toggle theme"
		variant="outline"
		size="sm"
		class="px-0 text-lg data-[state=on]:bg-transparent hover:border-primary transition-colors duration-200"
	>
		<Icon
			:name="isTheme ? 'tabler:moon' : 'tabler:sun-high'"
			class="w-full transition-transform duration-300"
			:class="isTheme ? 'rotate-0 scale-100' : 'text-primary rotate-90 scale-75'"
		/>
	</Toggle>
</template>
