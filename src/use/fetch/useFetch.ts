import { computed, isRef, reactive, Ref, ref, toRefs, unref, watch } from 'vue';

export const useUrlQuery = <T, K = T | null>(url: string | Ref<string>, initial: K) => {
  const result = ref<K>(initial);
  const state = reactive({
    isLoading: false,
    error: null as any,
  });

  let controller: AbortController | null = null;
  const reload = async () => {
    controller?.abort();
    state.isLoading = true;
    try {
      controller = new AbortController();

      const res = await fetch(`${import.meta.env.VITE_API_URL}${unref(url)}`, { signal: controller.signal });
      result.value = await res.json();

      state.isLoading = false;
    } catch (e) {
      if (e.name === 'AbortError') return; // request was aborted

      // will set error and disable `isLoading` only if it wasn't aborted
      state.isLoading = false;
      state.error = e;
    }
  };

  if (isRef(url)) {
    // if url is reactive
    watch(url, reload);
  }

  reload();

  return {
    result,
    ...toRefs(state),
    reload,
  };
};

type ParamType = string | number | boolean;
type ParamsType = Record<string, ParamType>;
export const useUrlParams = (base: string, params: ParamsType | Ref<ParamsType>) => {
  return computed(() => {
    const search = new URLSearchParams();
    const obj = unref(params); // unwrap in case if it's Ref
    const entries = Object.entries(obj)
      .filter((e) => e[1] != null)
      .filter((e) => (typeof e[1] == 'string' ? e[1].length > 0 : true))
      .sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0));
    entries.forEach(([key, value]) => search.append(key, value.toString()));

    return `${base}?${search}`;
  });
};
// in setup:
// const { result: list } = useUrlQuery(
//   useUrlParams('/items', fitler),
//   []
// );
