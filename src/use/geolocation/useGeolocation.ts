import { onUnmounted, onMounted, ref } from 'vue';
// import { useGeolocation } from '@vueuse/core';

export function useGeolocation() {
  const coords = ref({ latitude: 0, longitude: 0 }); // <google.maps.LatLngLiteral>
  const isSupported = 'navigator' in window && 'geolocation' in navigator;

  let watcher: any = null;

  onMounted(() => {
    if (isSupported) watcher = navigator.geolocation.watchPosition((position) => (coords.value = position.coords));
  });

  onUnmounted(() => {
    if (watcher) navigator.geolocation.clearWatch(watcher);
  });

  return { coords };
}
