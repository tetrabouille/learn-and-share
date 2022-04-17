import type { Story } from './story.type';

export type Tag = {
  id?: number;
  name?: string;
  lang?: string;
  stories?: Story[];
  translations?: Tag[];
  translationRef?: Tag;
  meanings?: Tag[];
  meaningRef?: Tag;
};
