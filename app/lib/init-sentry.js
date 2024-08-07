import { init, setUser, BrowserTracing } from '@sentry/browser';

function onUnhandledPromiseRejection(event) {
  event.preventDefault();
  console.warn(event.reason);
}

export default function initSentry() {
  init({
    dsn: 'https://36a5af57df8b426ba710c0accec90544@o274434.ingest.sentry.io/5623615',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0
  });
  window.onunhandledrejection = onUnhandledPromiseRejection;
}

export function addSentryUser(user) {
  const sentryUser = user ? { id: user.id, username: user.login } : null;
  setUser(sentryUser);
}
