import { v2 as googleTranslate } from '@google-cloud/translate';
import logger from './logger';
const translateApi = new googleTranslate.Translate();

const translateText = async (text: string, langDst: string) => {
  try {
    const data = await translateApi.translate(text, langDst);
    return data[0];
  } catch (e) {
    logger.error(e);
    return null;
  }
};

const fetchTranslation = async <T>(
  model: any,
  id: string | number,
  langDst: string
): Promise<{ dataRef?: T; translation?: T } | null> => {
  const data = await model.findUnique({
    where: { id: Number(id) },
    include: { translations: true },
  });
  if (!data) return null;
  if (data.lang === langDst) return { translation: data };

  const dataRef = data.translationRefId
    ? await model.findUnique({
        where: { id: Number(data.translationRefId) },
        include: { translations: true },
      })
    : data;
  if (!dataRef) return null;
  if (dataRef?.lang === langDst) return { translation: dataRef };

  const fetchedTranslation = dataRef.translations.find((t: any) => t.lang === langDst);
  if (fetchedTranslation) return { translation: fetchedTranslation };

  return { dataRef };
};

export { translateText, fetchTranslation };
