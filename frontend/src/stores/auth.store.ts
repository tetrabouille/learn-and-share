import { readable, writable } from 'svelte/store';
import type { ReadableQuery } from 'svelte-apollo';
import { BehaviorSubject, take } from 'rxjs';
import { supabase } from '@/libs/supabase';
import decode from 'jwt-decode';

import { routeConfigs } from '@/configs/routes';
import { addAvatarToProfile } from '@/utils/profile';

import type { LoggedUser, User } from '@/types/user.type';

const tokenInStorage: string = localStorage.getItem('token') || null;

const $token = new BehaviorSubject<string | null>(tokenInStorage);

const token = readable<string>(tokenInStorage, (set) => {
  const sub = $token.subscribe((token) => {
    localStorage.setItem('token', token);
    set(token);
  });
  return () => sub.unsubscribe();
});

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    $token.next(session.access_token);
  }
});

const requireLogginRoutes = routeConfigs.filter((r) => r.requireLogin).map((r) => r.path);
const emptyLoggedUser: LoggedUser = { user: null, loading: false, isConnected: false };

const accountCreated = writable<boolean>(false);
const loggedUser = writable<LoggedUser>({ ...emptyLoggedUser });

const setLoggedUser = async (token: string, query: ReadableQuery<{ user: User }>) => {
  if (token) {
    try {
      const decoded = decode<{ sub: string; exp: number }>(token);

      if (decoded.exp < Date.now() / 1000) return logout();

      await query.refetch({ accountId: decoded.sub });
      query.subscribe(({ data, loading }) => {
        const user = (() => {
          if (data?.user) return { ...data.user, profile: addAvatarToProfile(data.user) };
          return data?.user;
        })();
        loggedUser.set({ user, loading, isConnected: !!user?.id });
      });
    } catch (err) {
      logout();
    }
  } else {
    logout();
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

const logout = (path?: string, navigate?: (r: string) => void) => {
  void supabase.auth.signOut();
  $token.next(null);
  localStorage.removeItem('token');
  loggedUser.set({ ...emptyLoggedUser });
  if (path && navigate && requireLogginRoutes.find((r) => path.includes(r))) navigate('/');
};

const setupLoggedUser = (query: ReadableQuery<{ user: User }>) => {
  $token.pipe(take(1)).subscribe((token) => void setLoggedUser(token, query));
};

export { login, token, logout, accountCreated, loggedUser, setupLoggedUser, loadingUser };
