import { getByTag } from 'locale-codes';

import type { Profile } from '@/types/profile.type';
import { addAlert } from '@/stores/alert.store';
import { handleError } from '@/utils/errors';

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
  navigate: (r: string) => void
) => {
  if (!lang || !getByTag(lang) || !profile) return;
  const langs = profile.langs && profile.langs?.filter((l) => l !== lang);

  profileUpdate({
    variables: {
      id: profile.id,
      input: {
        langs: [lang, ...(langs ? langs : [])],
      },
    },
  })
    .then(handleError('Failed to change language', 'profileUpdate', navigate))
    .catch((err) => {
      console.error(err);
      addAlert('Failed to change language', 'error');
    });
};

export { getAge, getGender, handleLangSelected };
