<script lang="ts">
  import { mutation, query } from 'svelte-apollo';
  import { navigate } from 'svelte-routing';
  import debounce from 'lodash/debounce';

  import { addAlert } from '@/stores/alert.store';
  import { setFormContext } from '@/contexts/form.context';
  import { TOPIC_GET_ALL } from '@/queries/topic.query';
  import { TAG_ADD, TAG_GET_ALL } from '@/queries/tag.query';
  import InputTextArea from '@/components/forms/InputTextArea.svelte';
  import InputText from '@/components/forms/InputText.svelte';
  import InputSelect from '@/components/forms/InputSelect.svelte';
  import InputMultiSelect from '@/components/forms/InputMultiSelect.svelte';

  import { formatTitle, type FormOption } from '@/utils/form';
  import { handleError } from '@/utils/errors';
  import type { Topic } from '@/types/topic.type';
  import type { Tag } from '@/types/tag.type';
  import type { TagPayload } from '@/types/tag.type';
  import type { GetAllArgs } from '@/types/commun.type';

  let tagGetAllVar: GetAllArgs = {
    pagination: { take: 6 },
    sortList: [{ field: 'createdAt', order: 'desc' }],
  };

  $: tagGetAllVar.pagination.take = 6 + Number($data.tags.length);

  const topicGetAllQuery = query<{ topics: Topic[] }>(TOPIC_GET_ALL);
  const tagGetAllQuery = query<{ tags: Tag[] }, GetAllArgs>(TAG_GET_ALL, { variables: tagGetAllVar });

  const tagAddMutation = mutation<{ tagAdd: TagPayload }>(TAG_ADD);

  const { data } = setFormContext({
    title: '',
    content: '',
    lesson: '',
    tags: [],
    topic: '',
  });

  const handleTagSearch = (e: CustomEvent<{ value: string }>) => {
    return tagGetAllQuery.refetch({
      filters: [{ field: 'name', value: e.detail.value, contains: true }],
      ...tagGetAllVar,
    });
  };

  const handleTagSelected = (e: CustomEvent<{ option: FormOption }>) => {
    if ($tagGetAllQuery.data?.tags?.find(({ name }) => e.detail.option.text === name)) return;

    tagAddMutation({ variables: { input: { name: e.detail.option.text, lang: 'en' } } })
      .then(handleError('Failed to add tag', 'tagAdd', navigate))
      .catch((e) => {
        console.error(e);
        addAlert('Failed to add tag', 'error');
      });
  };

  $: topics = $topicGetAllQuery.data?.topics?.map(({ id, name }) => ({
    id: String(id),
    text: name,
  }));

  $: tags = $tagGetAllQuery.data?.tags?.map(({ id, name }) => ({
    id: String(id),
    text: name,
  }));
</script>

<section class="flex flex-col items-center pt-10">
  <h1 class="pb-5 text-3xl font-bold">Share your story</h1>
  <div class="container max-w-[770px] rounded-lg bg-yellow-400/30 p-5">
    <InputText fieldId="title" placeholder="Title of your story" style="h1" label="Title" />
    <InputSelect
      fieldId="topic"
      style="h1"
      options={topics}
      placeholder="Select a topic"
      messageEmpty="No topics matches"
      label="Topic"
    />
    <InputMultiSelect
      fieldId="tags"
      style="h1"
      placeholder="Add/Select a tag"
      label="Tags"
      max={3}
      options={tags}
      formatInput={formatTitle}
      on:selected={handleTagSelected}
      on:inputsearch={debounce(handleTagSearch, 300)}
    />
    <InputTextArea fieldId="content" style="h1" label="Story" />
  </div>
</section>
