import queryString from 'query-string';
import type { RouteLocation } from 'svelte-routing/types/Route';
import { writable } from 'svelte/store';

export type LocationStore = {
  pathname: string;
  params: Record<string, string | string[]>;
};

const locationStore = writable<LocationStore>({
  pathname: '',
  params: {},
});

const setLocation = (location: RouteLocation) => {
  locationStore.set({
    pathname: location.pathname,
    params: queryString.parse(location.search) || {},
  });
};

export { locationStore, setLocation };
