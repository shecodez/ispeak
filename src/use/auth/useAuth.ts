import { reactive } from 'vue';
import { Session, Provider } from '@supabase/gotrue-js/dist/main/lib/types';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

import { Credentials } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';

const toast = useToast();
const router = useRouter();

type State = {
  isLoading: boolean;
  userSession: Session | null;
  error: null | Error;
};

const state = reactive<State>({
  isLoading: false,
  userSession: null,
  error: null,
});

/**
 * create profile record.
 * @param id auth user.id (supabase private.users table)
 * @param username optional - defaults to `user${md5.len(8)}`
 */
async function createUserProfile(id: string, username?: string): Promise<void> {
  try {
    const { error } = await supabase.from('profiles').insert({ id, username });
    if (error) throw error;
  } catch (e) {
    toast.error('Error creating user profile');
    state.error = e.error_description || e.message;
  }
}

/**
 * Handles user sign in via email + password into a supabase session.
 * If password is empty, it will send a magic link to the users email address.
 * @param credentials email - required, password - optional
 */
async function login(credentials: Credentials): Promise<void> {
  try {
    state.isLoading = true;
    const { error, user } = await supabase.auth.signIn({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) throw error;

    // No error throw, but no user detected so send magic link
    if (!error && !user) {
      toast('Sent you a link, check your email');
    }
  } catch (e) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

/**
 * Handles sign up provided a valid credentials object.
 * @param credentials requires email, password
 */
async function register(credentials: Credentials): Promise<void> {
  try {
    state.isLoading = true;
    const { user, error } = await supabase.auth.signUp({ email: credentials.email, password: credentials.password });
    if (error) throw error;

    if (user) {
      await createUserProfile(user.id, credentials.username);
    }
    toast.success('Registration successful, confirmation e-mail should be sent soon!');
  } catch (e) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

/**
 * Handles sign up via Third Pary Login.
 * https://supabase.io/docs/guides/auth#third-party-logins
 */
async function signUpWithOAuth(provider: Provider): Promise<void> {
  try {
    state.isLoading = true;
    const { user, error } = await supabase.auth.signIn({ provider });
    if (error) throw error;

    if (user) await createUserProfile(user.id);
    // toast.success(`Sign In with ${provider} successful.`);
  } catch (e) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

/**
 * Handles sign up via Google
 */
function signInWithGoogle() {
  signUpWithOAuth('google');
}

/**
 * Handles password reset. Will send an email to the given email address.
 * @param email
 */
async function sendPasswordReset(email: string): Promise<void> {
  try {
    state.isLoading = true;
    const { error } = await supabase.auth.api.resetPasswordForEmail(email);
    if (error) throw error;

    toast(`Password recovery email has been sent to '${email}'`);
  } catch (e) {
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

/**
 * Handles updating user credentials.
 * If password is empty, it will send a magic link to the users email address.
 * @param credentials - email, username, password, provider
 */
async function updateUser(credentials: Credentials): Promise<void> {
  try {
    state.isLoading = true;
    const { error } = await supabase.auth.update(credentials);
    if (error) throw error;

    // TODO: if username update profiles too
    toast.success('User info successfully updated!');
    router.push('/');
  } catch (e) {
    toast.error('Error updating user info');
    state.error = e.error_description || e.message;
  } finally {
    state.isLoading = false;
  }
}

/**
 * Handles sign out a user from a superbase session
 */
async function logout(): Promise<void> {
  try {
    state.isLoading = true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    toast('You are logged out.');
    router.push('/');
  } catch (e) {
    toast.error('Oops, unknown error signing out.');
    console.error('SignOut Error:', e.error_description || e.message);
  } finally {
    state.isLoading = false;
  }
}

export { state as auth, login, register, signInWithGoogle, sendPasswordReset, updateUser, logout };