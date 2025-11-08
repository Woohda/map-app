<script setup lang="ts">
import type { AuthResponse } from '~lib/types/api';
import type { SignUpValues } from '~lib/types/validation';

import { toTypedSchema } from '@vee-validate/zod';
import { signUpSchema } from '~lib/types/validation';

import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { toast } from '~/composables/use-toast';

const formError = ref('');
const loading = ref(false);

async function onSubmit(
	values: unknown,
	{ resetForm, setFieldValue }: { resetForm: () => void; setFieldValue: (field: string, value: string) => void },
) {
	loading.value = true;
	formError.value = '';

	try {
		const formData = values as SignUpValues;

		await $fetch<AuthResponse>('/api/auth/signup', {
			method: 'POST',
			body: formData,
		});
		resetForm();
		toast({
			description: 'Вы успешно зарегистрировались',
			variant: 'success',
		});
		await navigateTo('/');
	}
	catch (error: unknown) {
		if (error?.response?._data?.statusCode === 409 && error?.response?._data?.data?.field) {
			setFieldValue(error?.response?._data?.data?.field, '');
			setFieldValue('password', '');
		}
		// универсально достаём сообщение из разных версий Nuxt/$fetch
		formError.value
			= error?.response?._data?.message
				|| 'Ошибка регистрации. Попробуйте еще раз';
	}
	finally {
		loading.value = false;
	}
}
</script>

<template>
	<Form v-slot="{ meta }" :validation-schema="toTypedSchema(signUpSchema)" class="w-full max-w-sm mx-auto flex flex-col gap-4" @submit="onSubmit">
		<fieldset :disabled="loading" class="w-full space-y-4">
			<FormField v-slot="{ field, errorMessage }" name="name">
				<FormItem>
					<FormLabel class="mb-1">
						Имя
					</FormLabel>
					<FormControl>
						<Input v-bind="field" type="text" placeholder="Напишите ваше имя" />
					</FormControl>
					<Transition name="fade-slide">
						<FormMessage class="text-xs">
							{{ errorMessage }}
						</FormMessage>
					</Transition>
				</FormItem>
			</FormField>

			<FormField v-slot="{ field, errorMessage }" name="email">
				<FormItem>
					<FormLabel class="mb-1">
						Почта
					</FormLabel>
					<FormControl>
						<Input v-bind="field" type="email" placeholder="Напишите адрес вашей почты" />
					</FormControl>
					<Transition name="fade-slide">
						<FormMessage class="text-xs">
							{{ errorMessage }}
						</FormMessage>
					</Transition>
				</FormItem>
			</FormField>

			<FormField v-slot="{ field, errorMessage }" name="username">
				<FormItem>
					<FormLabel class="mb-1">
						Имя пользователя
					</FormLabel>
					<FormControl>
						<Input v-bind="field" type="text" placeholder="Придумайте имя пользователя" />
					</FormControl>
					<Transition name="fade-slide">
						<FormMessage class="text-xs">
							{{ errorMessage }}
						</FormMessage>
					</Transition>
				</FormItem>
			</FormField>

			<FormField v-slot="{ field, errorMessage }" name="password">
				<FormItem>
					<FormLabel class="mb-1">
						Пароль
					</FormLabel>
					<FormControl>
						<Input v-bind="field" type="password" placeholder="Придумайте пароль" />
					</FormControl>
					<Transition name="fade-slide">
						<FormMessage class="text-xs">
							{{ errorMessage }}
						</FormMessage>
					</Transition>
				</FormItem>
			</FormField>
		</fieldset>

		<Button type="submit" class="w-full flex items-center justify-center gap-2 cursor-pointer" :disabled="loading || !meta.valid">
			<span v-if="loading" class="flex gap-1">
				<Spinner class="size-5" />
				Регистрируем...
			</span>
			<span v-else>Зарегистрироваться</span>
		</Button>

		<Transition name="fade">
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

/* Плавное появление общего сообщения */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}
</style>
