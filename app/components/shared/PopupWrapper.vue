<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue';

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
				class="absolute top-20 left-1/2 w-full max-w-sm -translate-x-1/2 z-50 max-[430px]:max-w-[90%]"
			>
				<div
					class="relative rounded-2xl p-3 shadow-2xl border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/65"
					@click.stop
				>
					<Button
						variant="ghost"
						size="s"
						class="absolute top-3 right-3 p-1 rounded-md border bg-background hover:bg-muted transition-colors"
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
