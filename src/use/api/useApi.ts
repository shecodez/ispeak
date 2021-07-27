import { ref, watch } from 'vue';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useApi = (endpoint: string, access_token?: string) => {
  const data = ref([]);
  const isLoading = ref(false);
  const error = ref<Error | AxiosError>();

  const router = useRouter();
  const toast = useToast();

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
      Authorization: access_token ? `Bearer ${access_token}` : undefined,
    },
  });

  const get = async (query?: Record<string, any>, config?: AxiosRequestConfig) => {
    isLoading.value = true;
    error.value = undefined;

    let params = '';
    if (query) {
      params =
        '?' +
        Object.entries(query)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
    }

    //await sleep(1500); // simulate irl delay

    return api
      .get(endpoint + params, config)
      .then((res) => (data.value = res.data))
      .catch((err) => {
        error.value = err;
        toast.error(err.message, { timeout: 4000 });
      })
      .finally(() => (isLoading.value = false));
  };

  const post = async (payload?: Record<string, any>) => {
    isLoading.value = true;
    error.value = undefined;

    //await sleep(1500); // simulate irl delay

    return api
      .post(endpoint, payload)
      .then((res) => (data.value = res.data))
      .catch((err) => {
        error.value = err;
        toast.error(err.message, { timeout: 4000 });
      })
      .finally(() => (isLoading.value = false));
  };

  const del = async () => {
    isLoading.value = true;
    error.value = undefined;

    //await sleep(1500); // simulate irl delay

    return api
      .delete(endpoint)
      .then((res) => (data.value = res.data))
      .catch((err) => {
        error.value = err;
        toast.error(err.message, { timeout: 4000 }); // throw err;
      })
      .finally(() => (isLoading.value = false));
  };

  watch([error], () => {
    // If 401 Unauthorised, redirect to login
    if (axios.isAxiosError(error.value)) {
      if (error.value.response.status === 401 && router) {
        router.push('/login'); // TODO: store path to go back after login
      }
    }
  });

  return { data, isLoading, error, get, post, del };
};
