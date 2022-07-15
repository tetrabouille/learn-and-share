import { NEW_OPTION } from '@/utils/form';
import type { Filter } from '@/types/commun.type';
import type { Tag } from '@/types/tag.type';
import type { FormOption } from './form';

const getTagIdsAndNewTags = (tags: FormOption[]) => {
  return tags.reduce(
    (acc: [number[], string[]], tag: FormOption) => {
      if (tag.id.includes(NEW_OPTION)) {
        acc[1].push(tag.text);
      } else {
        acc[0].push(Number(tag.id));
      }
      return acc;
    },
    [[], []]
  );
};

const getSearchTagsFilter = (value: string) => [{ field: 'name', value, option: 'contains' } as Filter];

const getTagOptions = (tags: Tag[]): FormOption[] =>
  tags.map(({ id, name }: Tag) => ({ id: String(id), text: name }));

export { getTagIdsAndNewTags, getSearchTagsFilter, getTagOptions };
