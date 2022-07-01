import locales from 'locale-codes';
import countries from 'country-list';

const unique = async (search: any, prismaClient: { findFirst: (s: any) => Promise<any> }) => {
  const exists = await prismaClient.findFirst({ where: search });
  if (exists) return false;
  return true;
};

const lang = (lang?: string) => {
  if (!lang) return false;
  return !!locales.getByTag(lang);
};

const langs = (langsList?: string[]) => {
  if (!langsList?.length) return true;
  return langsList.find((l) => !lang(l)) === undefined;
};

const country = (country?: string) => {
  if (!country) return false;
  return !!countries.getName(country);
};

export { unique, lang, langs, country };
