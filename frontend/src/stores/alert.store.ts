import { writable } from 'svelte/store';

const alertDelay = 3000;

export type Alert = {
  type: 'success' | 'error' | 'info';
  message: string;
};

const alertStore = writable<Alert[]>([]);

const addAlert = (message: Alert['message'], type: Alert['type'] = 'info') => {
  let existingAlert: Alert;
  alertStore.update((alerts) => {
    existingAlert = alerts.find((alert) => alert.message === message);
    if (existingAlert) return alerts;
    return [...alerts, { message, type }];
  });
  if (existingAlert) return;
  setTimeout(
    () =>
      alertStore.update((alerts) => {
        const index = alerts.findIndex((alert) => alert.message === message);
        if (index !== -1) alerts.splice(index, 1);
        return alerts;
      }),
    alertDelay
  );
};

const removeAlert = (alert: Alert) => {
  alertStore.update((alerts) => {
    const index = alerts.findIndex((a) => a.message === alert.message);
    if (index !== -1) alerts.splice(index, 1);
    return alerts;
  });
};

export { addAlert, alertStore, removeAlert };
