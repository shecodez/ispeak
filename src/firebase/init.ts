import { getApp, initializeApp } from 'firebase/app';

try {
  getApp();
} catch {
  const isDev = process.env.NODE_ENV === 'development';

  // eslint-disable-next-line no-console
  if (isDev) console.log('Using development firebase environment.');

  initializeApp(
    isDev
      ? {
          apiKey: `${import.meta.env.VITE_FIREBASE_API_KEY}`,
          authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
          projectId: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}`,
          storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
          messagingSenderId: `${import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID}`,
          appId: `${import.meta.env.VITE_DEV_FIREBASE_APP_ID}`,
        }
      : {
          apiKey: `${import.meta.env.VITE_FIREBASE_API_KEY}`,
          authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
          projectId: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}`,
          storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
          messagingSenderId: `${import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID}`,
          appId: `${import.meta.env.VITE_FIREBASE_APP_ID}`,
          //measurementId: ''
        }
  );
}
