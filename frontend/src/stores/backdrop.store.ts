import { writable } from 'svelte/store';

export type Backdrop = {
  open: boolean;
};

const backdropStore = writable<Backdrop>({
  open: false,
});

export { backdropStore };
