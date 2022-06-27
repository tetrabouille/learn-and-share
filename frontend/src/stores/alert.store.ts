import { Subject } from 'rxjs';
import { writable } from 'svelte/store';

const alertDelay = 7000;

export type Alert = {
  type: 'success' | 'error' | 'info';
  message: string;
  timeout: NodeJS.Timeout;
};

const alertStore = writable<Alert[]>([]);
const newAlert = new Subject<void>();

const addAlert = (message: Alert['message'], type: Alert['type'] = 'info') => {
  newAlert.next();
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
    return [{ message, type, timeout }, ...alerts];
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

const removeAllAlerts = () => {
  alertStore.update((alerts) => {
    alerts.forEach((alert) => clearTimeout(alert.timeout));
    return [];
  });
};

export { addAlert, alertStore, removeAlert, removeAllAlerts, newAlert };
