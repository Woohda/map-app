<script setup lang="ts">
const { error } = defineProps<{
	error?: { statusCode?: number; statusMessage?: string; message?: string };
}>();
</script>

<template>
	<div
		class="max-w-sm min-h-screen w-full m-auto flex flex-col gap-5 items-center justify-center bg-background text-foreground select-none animate-fade-in"
		style="color: var(--color-primary)"
	>
		<div
			v-if="error?.statusCode === 404"
			class="relative"
			aria-hidden="true"
		>
			<span class="text-9xl font-extrabold text-primary leading-none">4</span>
			<span><Icon
					name="tabler:map-pin-off"
					class="drop-shadow-lg animate-swing"
					style="width: 7rem; height: 7rem;"
				/>
				<span
					class="absolute inset-0 rounded-full bg-primary/30 blur-3xl opacity-60 animate-pulseLight"
					style="box-shadow: 0 0 20px 10px var(--color-primary)"
				/></span>
			<span class="text-9xl font-extrabold text-primary leading-none">4</span>
		</div>
		<h1 v-else class="text-9xl font-extrabold text-primary leading-none">
			{{ error?.statusCode }}
		</h1>
		<h2 class="text-3xl font-semibold">
			{{ error?.statusCode === 404 ? 'Страница не найдена' : error?.statusMessage || 'Произошла ошибка' }}
		</h2>
		<p class="text-center text-base text-foreground/70">
			{{ error?.statusCode === 404 ? 'Похоже, вы свернули не туда. Попробуйте вернуться на главную дорогу!' : error?.message || 'Пожалуйста, попробуйте позже.' }}
		</p>
		<Button
			type="button"
			variant="outline"
			class="group/button relative w-27 h-27 flex items-center justify-center shadow-none border-none rounded-2xl hover:scale-110 hover:bg-transparent transition duration-500 focus-visible:border-ring focus-visible:ring-ring/60 focus-visible:ring-[3.5px] outline-none"
			aria-label="На главную"
			@click="navigateTo('/', { replace: true })"
		>
			<Icon
				name="tabler:scan-position"
				class="absolute top-[-20px] left-[-20px] inset-0 pointer-events-none select-none text-foreground opacity-15 group-hover/button:text-primary group-hover/button:opacity-100 transition-all duration-300"
				style="width: 138%; height: 138%;"
			/>
			<span class="relative text-xl z-10 text-primary transition duration-300 group-hover/button:opacity-0">На главную</span>
		</Button>
	</div>
</template>

<style scoped>
@keyframes fade-in {
	from {
		opacity: 0;
		transform: translateY(16px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes swing {
	0%,
	100% {
		transform: translateY(11px);
	}
	50% {
		transform: translateY(-9px);
	}
}

@keyframes pulseLight {
	0%,
	100% {
		opacity: 0.6;
		box-shadow: 0 0 20px 10px var(--color-primary);
	}
	50% {
		opacity: 0.4;
		box-shadow: 0 0 30px 15px var(--color-primary);
	}
}

.animate-fade-in {
	animation: fade-in 0.5s ease-out forwards;
}

.animate-swing {
	animation: swing 3s ease-in-out infinite;
	transform-origin: center;
}

.animate-pulseLight {
	animation: pulseLight 3s ease-in-out infinite;
}
</style>
