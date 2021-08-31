<template>
  <div class="relative w-full h-full">
    <div ref="mapEl" class="w-full h-full" />
    <div class="absolute left-2 bottom-8">
      <div class="input-group flex items-center border rounded shadow-lg bg-white">
        <input class="p-3 md:w-xs" :placeholder="`${t('directions_from')}...`" />
        <button class="px-3 text-gray-500"><i-mdi-car class="text-lg" /></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-undef */
import { computed, defineComponent, onMounted, ref } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import { useI18n } from 'vue-i18n';

import { useGeolocation } from '@/use/geolocation';

export default defineComponent({
  name: 'GoogleMap',
  setup() {
    const { t } = useI18n();
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const { coords } = useGeolocation();

    const officePosition = computed(() => ({
      lat: 35.689487,
      lng: 139.691706,
    }));

    const userPosition = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude,
    }));

    const loader = new Loader({ apiKey });
    const mapEl = ref<HTMLElement | null>(null);
    let map = ref<google.maps.Map | null>(null);
    onMounted(async () => {
      await loader.load();
      map.value = new google.maps.Map(mapEl.value, {
        center: officePosition.value,
        zoom: 16, // 1-20
      });
    });

    return { t, userPosition, officePosition, mapEl };
  },
});
</script>
