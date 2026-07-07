<script setup lang="ts">
import type { LngLat } from '@yandex/ymaps3-types';

import AddLocationForm from '~/components/location/form/AddLocationForm.vue';

interface Props {
  coordinates: LngLat | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const formRef = ref<InstanceType<typeof AddLocationForm> | null>(null);

function handleSuccess() {
  emit('close');
}
function handleCancel() {
  formRef.value?.cancel();
  emit('close');
}
</script>

<template>
  <div class="flex flex-col gap-4 p-3">
    <h2 class="text-xl font-bold">
      Добавить локацию
    </h2>
    <AddLocationForm
      :coordinates="props.coordinates"
      @success="handleSuccess"
      @cancel="handleCancel"
    />
  </div>
</template>
