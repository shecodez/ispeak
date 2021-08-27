import { ref } from '@vue/runtime-core';
import { Session, Provider } from '@supabase/gotrue-js/dist/main/lib/types';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import { Credentials } from '@/data/interfaces';
import { supabase } from './db';

const router = useRouter();
const toast = useToast();

export const userSession = ref<Session | null>(null);

/**
 * Handles user login via email + password into a supabase session.
 * If password is empty, it will send a magic link to the users email address.
 * @param email
 * @param password - optional
 * @returns user or error
 */
export function signIn(credentials: Credentials) {
  return supabase.auth.signIn({ email: credentials.email, password: credentials.password });
}

/**
 * Handles signup via Third Pary Login.
 * https://supabase.io/docs/guides/auth#third-party-logins
 * @returns user session or error
 */
export function signUpWithOAuth(provider: Provider) {
  return supabase.auth.signIn({ provider });
}

// Handles auth via Google.
export function signInWithGoogle() {
  return signUpWithOAuth('google');
}

/**
 * Handles logging a user out of a superbase session
 * @returns null or error
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast('You are logged out.');
    router.push('/');
  } catch (e) {
    toast.error('Oops, error signing out', { timeout: 5000 });
    console.error('SignOut Error:', e.error_description || e.message);
  }
}

/**
 * Handles signup provided a valid credentials object.
 * @param credentials requires email, password
 * @returns user or error
 */
export function signUp(credentials: Credentials) {
  return supabase.auth.signUp({ email: credentials.email, password: credentials.password });
}

/**
 * Handles password reset. Will send an email to the given email address.
 * @param email
 * @returns null or error
 */
export function sendPasswordResetEmail(email: string) {
  return supabase.auth.api.resetPasswordForEmail(email);
}

/**
 * Handles updating user credentials.
 * If password is empty, it will send a magic link to the users email address.
 * @param email
 * @param password
 * @param provider
 * @returns user or error
 */
export function updateUser(credentials: Credentials) {
  return supabase.auth.update(credentials);
}
