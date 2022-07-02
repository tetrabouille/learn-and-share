import { writable } from 'svelte/store';

export type Backdrop = {
  open: boolean;
};

const backdropStore = writable<Backdrop>({
  open: true,
});

export { backdropStore };
