<script setup lang="ts">
import type { SignInValues } from '~lib/types/validation';

import { toTypedSchema } from '@vee-validate/zod';
import { signInSchema } from '~lib/types/validation';
import { useAuthUserStore } from '~stores/auth';

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

const formError = ref('');
const loading = ref(false);
const showPassword = ref(false);
const { signIn } = useAuthUserStore();

async function onSubmit(
	values: unknown,
	{ resetForm }: { resetForm: () => void },
) {
	loading.value = true;
	formError.value = '';

	try {
		const formData = values as SignInValues;
		await signIn(formData);
	}
	catch (error: any) {
		formError.value
			= error?.response?._data?.message || 'Ошибка входа. Попробуйте еще раз';
	}
	finally {
		resetForm();
		loading.value = false;
	}
}

function toggleShowPassword() {
	showPassword.value = !showPassword.value;
}
</script>

<template>
	<Form
		v-slot="{ meta }"
		:validation-schema="toTypedSchema(signInSchema)"
		class="w-full max-w-sm mx-auto flex flex-col gap-4"
		@submit="onSubmit"
	>
		<fieldset :disabled="loading" class="w-full space-y-4">
			<FormField v-slot="{ field, errorMessage }" name="login">
				<FormItem>
					<FormLabel class="mb-1">
						Почта/Имя пользователя:
					</FormLabel>
					<FormControl>
						<Input
							v-bind="field"
							type="text"
							placeholder="Напиши что то одно"
							autocomplete="email"
						/>
					</FormControl>
					<Transition name="fade-slide" appear>
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
						<div class="relative">
							<Input
								v-bind="field"
								:type="showPassword ? 'text' : 'password'"
								placeholder="Напиши пароль, если помнишь"
								autocomplete="current-password"
							/>
							<Toggle
								:model-value="showPassword"
								lable="Show password"
								variant="outline"
								size="sm"
								class="absolute border-none bottom-0.5 right-px px-0 text-foreground data-[state=on]:bg-transparent hover:bg-transparent hover:text-primary transition-colors duration-200"
								@update:model-value="toggleShowPassword"
							>
								<Icon
									:key="showPassword ? 'eye' : 'eye-closed'"
									:name="showPassword ? 'tabler:eye' : 'tabler:eye-closed'"
									style="width: 23px; height: 23px"
								/>
							</Toggle>
						</div>
					</FormControl>
					<Transition name="fade-slide" appear>
						<FormMessage class="text-xs">
							{{ errorMessage }}
						</FormMessage>
					</Transition>
				</FormItem>
			</FormField>
		</fieldset>

		<Button
			type="submit"
			:disabled="loading || !meta.valid"
			class="w-full flex items-center justify-center gap-2 cursor-pointer"
		>
			<span v-if="loading" class="flex gap-0.5 items-baseline">
				Заходим
				<DotsLoader />
			</span>
			<span v-else>Войти</span>
		</Button>

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
