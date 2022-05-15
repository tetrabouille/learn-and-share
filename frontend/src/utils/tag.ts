import random from 'node-random-name';
import { mutation } from 'svelte-apollo';

import { addAlert } from '@/stores/alert.store';
import { TAG_ADD } from '@/graphql/tag.query';
import type { TagPayload } from '@/types/tag.type';

const tagAddMutation = mutation<TagPayload>(TAG_ADD);

const addRandomTags = async (n: number) => {
  const tags = Array.from({ length: n }).map(() => random({ seed: String(Math.random()), last: true }));

  await Promise.all(tags.map((tag) => tagAddMutation({ variables: { input: { name: tag, lang: 'en' } } })))
    .then(() => addAlert(`Tags added : ${n}`, 'success'))
    .catch(() => addAlert('Error adding tags', 'error'));
};

export { addRandomTags };
