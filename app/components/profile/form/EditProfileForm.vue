<script setup lang="ts">
import type { UserData } from '~lib/types/user';
import type { UpdateUserProfileValues } from '~lib/types/validation';

import { toTypedSchema } from '@vee-validate/zod';
import { updateUserProfileSchema } from '~lib/types/validation';
import { useAuthUserStore } from '~stores/auth';
import { storeToRefs } from 'pinia';

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
import { useToast } from '~/composables/use-toast';

const { toast } = useToast();
const formError = ref('');
const loading = ref(false);
const { currentUser } = storeToRefs(useAuthUserStore());
const formValues = ref<UpdateUserProfileValues>({
	name: '',
	email: '',
	bio: '',
});

const initialValues = computed((): UpdateUserProfileValues => {
	if (!currentUser.value) {
		return {
			name: '',
			email: '',
			bio: '',
		};
	}
	return {
		name: currentUser.value.name || '',
		email: currentUser.value.email || '',
		bio: currentUser.value.bio || '',
	};
});

const hasChanges = computed(() => {
	const current = formValues.value;
	const initial = initialValues.value;
	return current.name !== initial.name
		|| current.email !== initial.email
		|| current.bio !== initial.bio;
});

function updateFormValues(values: UpdateUserProfileValues) {
	formValues.value = values;
}

async function onSubmit(
	values: unknown,
) {
	loading.value = true;
	formError.value = '';

	try {
		const formData = values as UpdateUserProfileValues;
		const updatedData: Partial<UpdateUserProfileValues> = {};

		if (formData.name && formData.name !== currentUser.value?.name) {
			updatedData.name = formData.name;
		}
		if (formData.email && formData.email !== currentUser.value?.email) {
			updatedData.email = formData.email;
		}
		if (formData.bio !== undefined && formData.bio !== currentUser.value?.bio) {
			updatedData.bio = formData.bio;
		}

		if (Object.keys(updatedData).length === 0) {
			formError.value = 'Нет изменений для сохранения';
			return;
		}
		currentUser.value = await $fetch<UserData>('/api/user/update-user', {
			method: 'PATCH',
			body: updatedData,
		});

		toast({
			title: 'Профиль успешно обновлен!',
			variant: 'success',
		});
	}
	catch (error: any) {
		formError.value
			= error?.response?._data?.message
				|| 'Ошибка обновления профиля. Попробуйте еще раз';
	}
	finally {
		loading.value = false;
	}
}
</script>

<template>
	<Form v-slot="{ values }" :validation-schema="toTypedSchema(updateUserProfileSchema)" :initial-values="initialValues" @submit="onSubmit">
		<fieldset :disabled="loading" class="w-full flex flex-col gap-4 mb-4">
			<div class="hidden">
				{{ updateFormValues(values) }}
			</div>
			<div class="w-full flex items-start gap-10 max-xl:gap-5 max-sm:flex-col">
				<FormField v-slot="{ field, errorMessage }" name="name">
					<FormItem class="w-full">
						<FormLabel class="mb-1">
							Имя
						</FormLabel>
						<FormControl>
							<Input
								v-bind="field"
								type="text"
								:default-value="currentUser?.name"
							/>
						</FormControl>
						<Transition name="fade-slide" appear>
							<FormMessage class="text-xs">
								{{ errorMessage }}
							</FormMessage>
						</Transition>
					</FormItem>
				</FormField>

				<FormField v-slot="{ field, errorMessage }" name="email">
					<FormItem class="w-full">
						<FormLabel class="mb-1">
							Почта
						</FormLabel>
						<FormControl>
							<Input
								v-bind="field"
								type="email"
								autocomplete="email"
								:default-value="currentUser?.email"
							/>
						</FormControl>
						<Transition name="fade-slide" appear>
							<FormMessage class="text-xs">
								{{ errorMessage }}
							</FormMessage>
						</Transition>
					</FormItem>
				</FormField>
			</div>

			<FormField v-slot="{ field, errorMessage }" name="bio">
				<FormItem>
					<FormLabel class="mb-1">
						О себе
					</FormLabel>
					<FormControl>
						<Textarea
							v-bind="field"
							placeholder="Напишите что-нибудь о себе..."
							rows="3"
							:default-value="currentUser?.bio || ''"
						/>
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
			:disabled="loading || !hasChanges"
			class="flex items-center justify-center gap-2 cursor-pointer justify-self-end"
		>
			<span v-if="loading" class="flex gap-0.5 items-baseline">
				Сохраняем
				<DotsLoader />
			</span>
			<span v-else>Сохранить</span>
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
</style>
