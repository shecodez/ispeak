import { reactive } from 'vue';
import { Session, Provider } from '@supabase/gotrue-js/dist/main/lib/types';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

import { Credentials } from '@/data/types/mock';
import { supabase } from '@/lib/supabase';

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
 * update profile username.
 * @param id auth user.id (supabase private.users table)
 * @param username optional - defaults to `user${md5.len(8)}`
 */
async function updateProfileUsername(id: string, username?: string): Promise<void> {
  if (!username) return;

  try {
    const { error } = await supabase.from('profiles').update({ username }).match({ id });
    if (error) throw error;
  } catch (e) {
    useToast().error('Error creating updating profile');
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
      useToast()('Sent you a link, check your email');
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
      await updateProfileUsername(user.id, credentials.username);
    }
    useToast().success('Registration successful, confirmation e-mail should be sent soon!');
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
    const { error } = await supabase.auth.signIn({ provider });
    if (error) throw error;

    // if (user) await createUserProfile(user.id); profile now created with trigger
    // useToast()success(`Sign In with ${provider} successful.`);
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

    useToast()(`Password recovery email has been sent to '${email}'`);
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
    useToast().success('User info successfully updated!');
    useRouter().push('/');
  } catch (e) {
    useToast().error('Error updating user info');
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

    useToast()('You are logged out.');
    useRouter().push('/');
  } catch (e) {
    useToast().error('Oops, unknown error signing out.');
    console.error('SignOut Error:', e.error_description || e.message);
  } finally {
    state.isLoading = false;
  }
}

export { state as auth, login, register, signInWithGoogle, sendPasswordReset, updateUser, logout };
