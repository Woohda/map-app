<script
  setup
  lang="ts"
>
interface Props {
	show: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
	close: [];
}>();

function closePopup(): void {
	emit('close');
}
</script>

<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div
				v-if="show"
				class="fixed inset-0 z-40"
				@click="closePopup"
			/>
		</Transition>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="-translate-y-full opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="-translate-y-full opacity-0"
		>
			<div
				v-if="show"
				class="absolute top-19 left-1/2 w-full max-w-sm -translate-x-1/2 z-50"
			>
				<div
					class="relative rounded-2xl p-3 border bg-card shadow-2xl backdrop-blur-md"
					@click.stop
				>
					<Button
						variant="outline"
						size="s"
						class="absolute top-3 right-3 p-1 hover:bg-muted"
						@click="closePopup"
					>
						<Icon name="tabler:x" size="18" />
					</Button>
					<slot />
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>

</style>
