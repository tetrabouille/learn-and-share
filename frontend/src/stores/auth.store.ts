import { readable, writable } from 'svelte/store';
import type { ReadableQuery } from 'svelte-apollo';
import { BehaviorSubject, take } from 'rxjs';
import { supabase } from '@/libs/supabase';
import decode from 'jwt-decode';

import { routeConfigs } from '@/configs/routes';
import { getFile } from '@/utils/file';
import { addAlert } from '@/stores/alert.store';
import { Error } from '@/types/error.type';

import type { LoggedUser, User } from '@/types/user.type';
import type { UserError } from '@/types/error.type';

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
      await query.refetch({ accountId: decode<{ sub: string }>(token).sub });
      query.subscribe(({ data, loading }) => {
        const user = (() => {
          if (data?.user?.profile) {
            const url = data.user.profile.avatarUrl?.split('/').pop();
            const fileData = getFile(data.user, url);
            if (fileData.publicURL) {
              const avatarUrl = fileData.publicURL;
              return { ...data.user, profile: { ...data.user.profile, avatarUrl } };
            }
          }
          return data?.user;
        })();
        loggedUser.set({ user, loading, isConnected: !!user?.id });
      });
    } catch (err) {
      logout('', null);
    }
  } else {
    logout('', null);
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
  void supabase.auth.signOut();
  $token.next(null);
  localStorage.removeItem('token');
  loggedUser.set({ ...emptyLoggedUser });
  if (requireLogginRoutes.find((r) => path.includes(r))) navigate('/');
};

const setupLoggedUser = (query: ReadableQuery<{ user: User }>) => {
  $token.pipe(take(1)).subscribe((token) => void setLoggedUser(token, query));
};

const handleUserErrors = (errors: UserError[]) => {
  if (!errors.length) return;
  errors.forEach((error) => {
    addAlert(error.message, 'error');
    switch (error.code) {
      case Error.TOKEN_EXPIRED:
        // TODO
        break;
      default:
        break;
    }
  });
};

export { login, token, logout, accountCreated, loggedUser, setupLoggedUser, loadingUser, handleUserErrors };
