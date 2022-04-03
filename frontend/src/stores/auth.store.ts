import { readable, writable } from 'svelte/store';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '@/libs/supabase';

const tokenInStorage = localStorage.getItem('token') || null;

const $token = new BehaviorSubject<string | null>(tokenInStorage);

const token = readable(tokenInStorage, (set) => {
  const sub = $token.subscribe((token) => {
    set(token);
  });
  return () => sub.unsubscribe();
});

const accountCreated = writable(false);

const login = () => {
  const newToken = supabase.auth.session()?.access_token;
  console.log(supabase.auth.session());

  if (newToken) {
    $token.next(newToken);
    localStorage.setItem('token', newToken);
  }
};

const logout = () => {
  $token.next(null);
  localStorage.removeItem('token');
};

export { login, token, logout, accountCreated };
