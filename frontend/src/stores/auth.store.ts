import { readable, writable } from 'svelte/store';
import type { ReadableQuery } from 'svelte-apollo';
import { BehaviorSubject, take } from 'rxjs';
import { supabase } from '@/libs/supabase';
import decode from 'jwt-decode';

import { routeConfigs } from '@/configs/routes';

import type { LoggedUser, User } from '@/types/user.type';

const tokenInStorage: string = localStorage.getItem('token') || null;

const $token = new BehaviorSubject<string | null>(tokenInStorage);

const token = readable<string>(tokenInStorage, (set) => {
  const sub = $token.subscribe((token) => set(token));
  return () => sub.unsubscribe();
});

const requireLogginRoutes = routeConfigs.filter((r) => r.requireLogin).map((r) => r.path);
const emptyLoggedUser: LoggedUser = { user: null, loading: false, isConnected: false };

const accountCreated = writable<boolean>(false);
const loggedUser = writable<LoggedUser>({ ...emptyLoggedUser });

const setLoggedUser = async (token: string, query: ReadableQuery<{ user: User }>) => {
  if (token) {
    try {
      await query.refetch({ accountId: decode<{ sub: string }>(token).sub });
      query.subscribe(({ data, loading }) => {
        loggedUser.set({ user: data?.user, loading, isConnected: !!data?.user?.id });
      });
    } catch (err) {
      loggedUser.set({ ...emptyLoggedUser });
      console.error(err);
    }
  } else {
    loggedUser.set({ ...emptyLoggedUser });
  }
};

const loadingUser = (loading: boolean) => {
  loggedUser.update((user) => ({ ...user, loading }));
};

const login = async (query: ReadableQuery<{ user: User }>) => {
  const newToken = supabase.auth.session()?.access_token;
  if (newToken) {
    $token.next(newToken);
    localStorage.setItem('token', newToken);
    await setLoggedUser(newToken, query);
  }
};

const logout = (path: string, navigate: (r: string) => void) => {
  $token.next(null);
  localStorage.removeItem('token');
  loggedUser.set({ ...emptyLoggedUser });
  if (requireLogginRoutes.find((r) => path.includes(r))) navigate('/');
};

const setupLoggedUser = (query: ReadableQuery<{ user: User }>) => {
  $token.pipe(take(1)).subscribe((token) => void setLoggedUser(token, query));
};

export { login, token, logout, accountCreated, loggedUser, setupLoggedUser, loadingUser };
