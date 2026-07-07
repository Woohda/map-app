<script setup lang="ts">
import type { LngLat } from '@yandex/ymaps3-types';
import type { UploadedImage } from '~lib/types/upload';
import type { AddLocationFormValues, AddLocationValues } from '~lib/types/validation';

import { toTypedSchema } from '@vee-validate/zod';
import { addLocationFormSchema } from '~lib/types/validation';
import { useLocationStore } from '~stores/location';

import PhotoUpload from '~/components/location/form/PhotoUpload.vue';
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
  coordinates: LngLat | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();
const formError = ref('');
const loading = ref(false);
const images = ref<UploadedImage[]>([]);
const { addLocation } = useLocationStore();

const { resetAttachments, clearAttachments } = useAttachmentUpload();

const currentCoordinates = computed(() => props.coordinates || [0, 0]);

function cancel() {
  resetAttachments();
  emit('cancel');
}
defineExpose({
  cancel,
});

async function onSubmit(
  values: unknown,
  { resetForm }: { resetForm: () => void },
) {
  loading.value = true;
  formError.value = '';
  try {
    const formData = values as AddLocationFormValues;
    const submitData: AddLocationValues = {
      ...formData,
      longitude: currentCoordinates.value[0],
      latitude: currentCoordinates.value[1],
      images: images.value,
    };
    await addLocation(submitData);
    resetForm();
    images.value = [];
    clearAttachments();
    emit('success');
  }
  catch (error: any) {
    formError.value
      = error?.response?._data?.message
        || 'Ошибка добавления локации. Попробуйте еще раз';
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <Form
    v-slot="{ meta }"
    :validation-schema="toTypedSchema(addLocationFormSchema)"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <fieldset :disabled="loading" class="w-full space-y-4">
      <FormField v-slot="{ field, errorMessage }" name="name">
        <FormItem>
          <FormLabel class="mb-1">
            Название локации:
          </FormLabel>
          <FormControl>
            <Input v-bind="field" type="text" placeholder="Название локации" />
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
            <Textarea
              v-bind="field"
              placeholder="Напишите описание локации..."
              rows="3"
            />
          </FormControl>
          <Transition name="fade-slide" appear>
            <FormMessage class="text-xs">
              {{ errorMessage }}
            </FormMessage>
          </Transition>
        </FormItem>
      </FormField>

      <FormField name="images">
        <FormItem>
          <FormLabel class="mb-1">
            Фото локации:
          </FormLabel>
          <FormControl>
            <PhotoUpload
              v-model="images"
              :disabled="loading"
            />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField name="coordinates">
        <FormItem>
          <FormLabel class="mb-1">
            Координаты:
          </FormLabel>
          <FormControl class="text-sm text-muted-foreground">
            {{ currentCoordinates[0].toFixed(6) }},
            {{ currentCoordinates[1].toFixed(6) }}
          </FormControl>
        </FormItem>
      </FormField>
    </fieldset>

    <Button
      type="submit"
      :disabled="loading || !meta.valid"
      class="w-full flex gap-2"
    >
      <span v-if="loading" class="flex gap-0.5 items-baseline">
        Добавление
        <DotsLoader />
      </span>
      <span v-else>Добавить</span>
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
