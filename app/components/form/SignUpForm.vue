<script
    setup
    lang="ts"
>
import type { SignUpValues } from '~lib/validation';

import { toTypedSchema } from '@vee-validate/zod';
import { signUpSchema } from '~lib/validation';
import { useForm } from 'vee-validate';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';

const form = useForm<SignUpValues>({
	validationSchema: toTypedSchema(signUpSchema),
	initialValues: {
		username: '',
		name: '',
		email: '',
		password: '',
	},
});

const formDisabled = computed(() => form.isSubmitting.value);
</script>

<template>
	<Form v-slot="{ errors }" :disabled="formDisabled" class="w-full max-w-sm mx-auto space-y-4">
		<FormField v-slot="{ field, errorMessage }" name="name">
			<FormItem>
				<FormLabel>Имя</FormLabel>
				<FormControl>
					<Input v-bind="field" type="text" placeholder="Напишите ваше имя" />
				</FormControl>
				<FormMessage>{{ errorMessage }}</FormMessage>
			</FormItem>
		</FormField>

		<FormField v-slot="{ field, errorMessage }" name="email">
			<FormItem>
				<FormLabel>Email</FormLabel>
				<FormControl>
					<Input v-bind="field" type="email" placeholder="Напишите адрес вашей почты" />
				</FormControl>
				<FormMessage>{{ errorMessage }}</FormMessage>
			</FormItem>
		</FormField>

		<FormField v-slot="{ field, errorMessage }" name="username">
			<FormItem>
				<FormLabel>Имя пользователя</FormLabel>
				<FormControl>
					<Input v-bind="field" type="text" placeholder="Придумайте имя пользователя" />
				</FormControl>
				<FormMessage>{{ errorMessage }}</FormMessage>
			</FormItem>
		</FormField>

		<FormField v-slot="{ field, errorMessage }" name="password">
			<FormItem>
				<FormLabel>Пароль</FormLabel>
				<FormControl>
					<Input
						v-bind="field"
						type="password"
						placeholder="Придумайте пароль"
					/>
				</FormControl>
				<FormMessage>{{ errorMessage }}</FormMessage>
			</FormItem>
		</FormField>

		<!-- Кнопка с Spinner -->
		<Button :disabled="formDisabled" type="submit" class="w-full flex items-center justify-center gap-2">
			<template v-if="form.isSubmitting.value">
				<Spinner class="size-5" />
				Регистрируем...
			</template>
			<template v-else>
				Зарегистрироваться
			</template>
		</Button>
		<p v-if="Object.keys(errors).length" class="text-center text-sm text-destructive">
			{{ Object.values(errors)[0] }}
		</p>
	</Form>
</template>
