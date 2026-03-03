<script setup lang="ts">
import type { LngLat } from '@yandex/ymaps3-types';
import type { LocationFormData } from '~lib/types/map';
import type { AddLocationValues } from '~lib/types/validation';

import { toTypedSchema } from '@vee-validate/zod';
import { addLocationSchema } from '~lib/types/validation';

import { Button } from '~/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import DotsLoader from '~/components/ui/loader/DotsLoader.vue';
import { Textarea } from '~/components/ui/textarea';

interface Props {
	coordinates?: LngLat | null;
	onSubmit: (data: LocationFormData) => Promise<void>;
}

const props = defineProps<Props>();

const formError = ref('');
const loading = ref(false);

const currentCoordinates = computed(() => props.coordinates || [0, 0]);

async function onSubmit(
	values: unknown,
	{ resetForm }: { resetForm: () => void },
) {
	loading.value = true;
	formError.value = '';

	try {
		const formData = values as AddLocationValues;
		const submitData: LocationFormData = {
			...formData,
			coordinates: currentCoordinates.value,
		};

		await props.onSubmit(submitData);
		resetForm();
	}
	catch (error: any) {
		formError.value
			= error?.response?._data?.message || 'Ошибка добавления локации. Попробуйте еще раз';
	}
	finally {
		loading.value = false;
	}
}
</script>

<template>
	<Form
		v-slot="{ meta }"
		:validation-schema="toTypedSchema(addLocationSchema)"
		class="flex flex-col gap-4"
		@submit="onSubmit"
	>
		<fieldset :disabled="loading" class="w-full space-y-4">
			<FormField v-slot="{ field, errorMessage }" name="title">
				<FormItem>
					<FormLabel class="mb-1">
						Название:
					</FormLabel>
					<FormControl>
						<Input
							v-bind="field"
							type="text"
							placeholder="Название локации"
						/>
					</FormControl>
					<Transition name="fade-slide" appear>
						<FormMessage class="text-xs">
							{{ errorMessage }}
						</FormMessage>
					</Transition>
				</FormItem>
			</FormField>

			<FormField v-slot="{ field, errorMessage }" name="description">
				<FormItem>
					<FormLabel class="mb-1">
						Описание локации:
					</FormLabel>
					<FormControl>
						<Textarea v-bind="field" placeholder="Напишите описание локации..." />
					</FormControl>
					<Transition name="fade-slide" appear>
						<FormMessage class="text-xs">
							{{ errorMessage }}
						</FormMessage>
					</Transition>
				</FormItem>
			</FormField>

			<FormField name="coordinates">
				<FormItem>
					<FormLabel class="mb-1">
						Координаты:
					</FormLabel>
					<FormControl>
						<span class="text-sm text-muted-foreground">{{ currentCoordinates[0].toFixed(6) }}, {{ currentCoordinates[1].toFixed(6) }}</span>
					</FormControl>
				</FormItem>
			</FormField>
		</fieldset>

		<div class="w-full flex gap-2">
			<Button
				type="submit"
				:disabled="loading || !meta.valid"
			>
				<span v-if="loading" class="flex gap-0.5 items-baseline">
					Добавление
					<DotsLoader />
				</span>
				<span v-else>Добавить</span>
			</Button>
		</div>

		<Transition name="fade-slide" appear>
			<p v-if="formError" class="text-destructive text-center text-xs">
				{{ formError }}
			</p>
		</Transition>
	</Form>
</template>

<style scoped>
/* Плавное появление ошибок */
.fade-slide-enter-active,
.fade-slide-leave-active {
	transition: all 0.5s ease;
}
.fade-slide-enter-from {
	opacity: 0;
	transform: translateY(-5px);
}
.fade-slide-enter-to {
	opacity: 1;
	transform: translateY(0);
}
.fade-slide-leave-from {
	opacity: 1;
	transform: translateY(0);
}
.fade-slide-leave-to {
	opacity: 0;
	transform: translateY(-5px);
}
</style>
