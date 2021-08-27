import './init';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  UserCredential,
  signOut,
} from 'firebase/auth';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

//import { useAnalytics } from './analytics'

export const useSignIn = () => {
  const auth = getAuth();
  const error = ref<Error | null>(null);

  //const { logEvent } = useAnalytics()

  const loginHandler = async (promise: Promise<UserCredential>) => {
    try {
      const { user } = await promise;
      //logEvent('login', { email: user.email })

      //const { data } = await setCustomUserClaims()
      //if (data.refetch) await auth.currentUser?.getIdToken(true)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      error.value = err;
    }
  };

  const google = () => {
    const googleProvider = new GoogleAuthProvider();
    const p = signInWithPopup(auth, googleProvider);
    loginHandler(p);
  };

  return { error, google };
};

export const useAuthState = () => {
  const user = ref<User | null>(null);
  const error = ref<Error | null>(null);

  const router = useRouter();
  const auth = getAuth();
  let unsubscribe: { (): any; (): void };
  onMounted(() => {
    unsubscribe = onAuthStateChanged(
      auth,
      (u) => (user.value = u),
      (e) => (error.value = e)
    );
  });
  onUnmounted(() => unsubscribe());

  const isLoggedIn = computed(() => user.value != null);

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/');
      // TOAST: 'you have logged out'
    } catch (e) {
      error.value = e.message;
    }
  };

  return { user, error, isLoggedIn, logout };
};

export const getUserState = () => new Promise((resolve, reject) => onAuthStateChanged(getAuth(), resolve, reject));
