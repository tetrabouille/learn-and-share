import random from 'node-random-name';
import { mutation } from 'svelte-apollo';

import { addAlert } from '@/stores/alert.store';
import { TOPIC_ADD } from '@/queries/topic.query';
import type { TopicPayload } from '@/types/topic.type';

const topicAddMutation = mutation<TopicPayload>(TOPIC_ADD);

const addRandomTopics = async (n: number) => {
  const topics = Array.from({ length: n }).map(() => random({ seed: String(Math.random()), last: true }));

  await Promise.all(
    topics.map((topic) => topicAddMutation({ variables: { input: { name: topic, lang: 'en' } } }))
  )
    .then(() => addAlert(`Topics added : ${n}`, 'success'))
    .catch(() => addAlert('Error adding topics', 'error'));
};

export { addRandomTopics };
