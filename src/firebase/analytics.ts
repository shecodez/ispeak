import './init';

import { AnalyticsCallOptions, getAnalytics, logEvent as firebaseLogEvent } from 'firebase/analytics';

export const useAnalytics = () => {
  const analytics = getAnalytics();
  const logEvent = (eventName: string, eventParams?: { [key: string]: any }, options?: AnalyticsCallOptions) => {
    return firebaseLogEvent(analytics, eventName, eventParams, options);
  };
  return { analytics, logEvent };
};
