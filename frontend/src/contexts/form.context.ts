import { setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { Error } from '@/utils/form';
import type { Writable } from 'svelte/store';

export type FormContext = {
  data: Writable<any>;
  errors: Writable<Error[]>;
  touched: Writable<boolean>;
};

const setFormContext = (data: any, key = 'form'): FormContext => {
  const dataStore = writable<any>(data);
  const errorsStore = writable<Error[]>([]);
  const touchedStore = writable<boolean>(false);

  setContext(key, {
    data: dataStore,
    errors: errorsStore,
    touched: touchedStore,
  });

  return { data: dataStore, errors: errorsStore, touched: touchedStore };
};

export { setFormContext };
