import locales from 'locale-codes';

const unique = async (search: any, prismaClient: { findFirst: (s: any) => Promise<any> }) => {
  const existingTag = await prismaClient.findFirst({ where: search });
  if (existingTag) return false;
  return true;
};

const lang = (lang: string) => {
  if (!lang) return false;
  return !!locales.getByTag(lang);
};

const langs = (langsList?: string[]) => {
  if (!langsList?.length) return true;
  return langsList.find((l) => !lang(l)) === undefined;
};

export { unique, lang, langs };
