
import { createContextProvider } from '@solid-primitives/context';
import type { AnalyticsCallOptions, Item } from 'firebase/analytics';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCLRjnefIa25Yh4qJaLE1Rt8PwOT0bFfBk',
  authDomain: 'umigg-96ff5.firebaseapp.com',
  projectId: 'umigg-96ff5',
  storageBucket: 'umigg-96ff5.appspot.com',
  messagingSenderId: '1098077456066',
  appId: '1:1098077456066:web:080f4cc4c94800d6f75d5b',
  measurementId: 'G-PXEXP0PLM2'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const fireabase = { app, analytics };

const ga = {
  logEvent: (
    eventName: string,
    eventParams?: {
      [
      key: string]: any
      coupon?: string; currency?: string
      items?: Item[]; payment_type?: string
      value?: number
    }, options?: AnalyticsCallOptions
  ) =>
    logEvent(analytics, 'select_content', {
      content_type: 'image',
      content_id: 'P12453',
      items: [{ name: 'Kittens' }]
    })
};

export const [FirebaseProvider, useFirebase] = createContextProvider(props => {
  return {
    fireabase,
    ga
  };
});
