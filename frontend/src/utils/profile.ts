import { getByTag } from 'locale-codes';

import { formatTitle } from './form';
import { handleError } from './errors';
import { addAlert } from '@/stores/alert.store';
import { loggedUser } from '@/stores/auth.store';
import type { Profile } from '@/types/profile.type';
import type { LoggedUser } from '@/types/user.type';

const getAge = (value: string | number) => {
  if (!value) return;

  let date: Date;
  const timestamp = Number(value);
  isNaN(timestamp) ? (date = new Date(value)) : (date = new Date(timestamp));

  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const m = now.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < date.getDate())) age -= 1;

  return `${age} years old`;
};

const getGender = (str: string) => {
  if (!str) return;
  if (str.toUpperCase() === 'M') return 'Male';
  if (str.toUpperCase() === 'F') return 'Female';
};

const handleLangSelected = (
  lang: string,
  profile: Profile,
  profileUpdate: any,
  optimisticUpdate: (langs: string[]) => void,
  navigate: (r: string) => void
) => {
  if (!lang || !getByTag(lang) || !profile) return;
  const langs = [...profile.langs];
  const filteredLangs = langs && langs?.filter((l) => l !== lang);
  const newLangs = [lang, ...(filteredLangs ? filteredLangs : [])];

  optimisticUpdate(newLangs);
  profileUpdate({
    variables: {
      id: profile.id,
      input: {
        langs: newLangs,
      },
    },
  })
    .then(handleError('Failed to change language', 'profileUpdate', navigate))
    .then(({ isError }) => {
      if (isError) optimisticUpdate(langs);
    })
    .catch((err) => {
      optimisticUpdate(langs);
      console.error(err);
      addAlert('Failed to change language', 'error');
    });
};

const langsToOptions = (langs: string[]) => {
  if (!langs) return [];
  return langs.map((l) => ({
    id: l,
    text: formatTitle(getByTag(l)?.name) || 'Unknown',
  }));
};

const getLoggedUserWithNewLangs = (langs: string[]) => (currentLoggedUser: LoggedUser) => {
  if (!currentLoggedUser.user) return currentLoggedUser;
  const { user } = currentLoggedUser;
  const { profile } = user;
  const newProfile = { ...profile, langs };
  const newUser = { ...user, profile: newProfile };
  return { ...currentLoggedUser, user: newUser };
};

const updateLoggedUserLangs = (langs: string[]) => {
  loggedUser.update(getLoggedUserWithNewLangs(langs));
};

export {
  getAge,
  getGender,
  handleLangSelected,
  langsToOptions,
  getLoggedUserWithNewLangs,
  updateLoggedUserLangs,
};
