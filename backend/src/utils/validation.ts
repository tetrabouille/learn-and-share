import locales from 'locale-codes';

const unique = async (search: any, prismaClient: { findFirst: (s: any) => Promise<any> }) => {
  const existingTag = await prismaClient.findFirst({ where: search });
  if (existingTag) return false;
  return true;
};

const lang = (lang: string) => {
  return locales.getByTag(lang);
};

export { unique, lang };
