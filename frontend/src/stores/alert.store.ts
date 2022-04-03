import { writable } from 'svelte/store';

const alertDelay = 7000;

export type Alert = {
  type: 'success' | 'error' | 'info';
  message: string;
  timeout: NodeJS.Timeout;
};

const alertStore = writable<Alert[]>([]);

const addAlert = (message: Alert['message'], type: Alert['type'] = 'info') => {
  let existingAlert: Alert;
  alertStore.update((alerts) => {
    existingAlert = alerts.find((alert) => alert.message === message);
    if (existingAlert) return alerts;
    const timeout = setTimeout(
      () =>
        alertStore.update((alerts) => {
          const index = alerts.findIndex((alert) => alert.message === message);
          if (index !== -1) alerts.splice(index, 1);
          return alerts;
        }),
      alertDelay
    );
    return [...alerts, { message, type, timeout }];
  });
};

const removeAlert = (alert: Alert) => {
  alertStore.update((alerts) => {
    const index = alerts.findIndex((a) => a.message === alert.message);
    if (index !== -1) {
      clearTimeout(alerts[index].timeout);
      alerts.splice(index, 1);
    }
    return alerts;
  });
};

export { addAlert, alertStore, removeAlert };
