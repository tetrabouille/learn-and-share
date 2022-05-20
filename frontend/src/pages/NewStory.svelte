<script lang="ts">
  import { mutation, query } from 'svelte-apollo';
  import debounce from 'lodash/debounce';

  import { addAlert } from '@/stores/alert.store';
  import { setFormContext } from '@/contexts/form.context';
  import { TOPIC_GET_ALL } from '@/graphql/topic.query';
  import { TAG_ADD, TAG_GET_ALL } from '@/graphql/tag.query';
  import InputTextArea from '@/components/forms/InputTextArea.svelte';
  import InputText from '@/components/forms/InputText.svelte';
  import InputSelect from '@/components/forms/InputSelect.svelte';
  import InputMultiSelect from '@/components/forms/InputMultiSelect.svelte';

  import type { FormOption } from '@/utils/form';
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

  const formatInput = (input: string) =>
    (() => {
      const formated = input
        .toLowerCase()
        .replace(/^(\s)*/g, '')
        .trim();
      return formated.charAt(0).toUpperCase().concat(formated.slice(1));
    })();

  const handleTagSearch = (e: CustomEvent<{ value: string }>) => {
    return tagGetAllQuery.refetch({
      filters: [{ field: 'name', value: e.detail.value, contains: true }],
      ...tagGetAllVar,
    });
  };

  const handleTagSelected = (e: CustomEvent<{ option: FormOption }>) => {
    if ($tagGetAllQuery.data?.tags?.find(({ name }) => e.detail.option.text === name)) return;

    tagAddMutation({ variables: { input: { name: e.detail.option.text, lang: 'en' } } })
      .then(({ data }) => {
        const {
          tagAdd: { userErrors },
        } = data;
        if (userErrors?.length) addAlert(userErrors.map((err) => err.message).join('; '), 'error');
      })
      .catch((e) => addAlert(e.message));
  };

  $: topics = $topicGetAllQuery.data?.topics?.map(({ id, name }) => ({
    id: String(id),
    text: name,
  }));

  $: tags = $tagGetAllQuery.data?.tags?.map(({ id, name }) => ({
    id: String(id),
    text: name,
  }));

  $: console.log('data :', $data);
</script>

<section class="container mx-auto w-3/4 min-w-[300px] text-warm-900/90">
  <h1 class="pt-10 text-center text-2xl">Write a new story</h1>
  <div class="mx-auto mt-5 max-w-[600px]">
    <InputText fieldId="title" placeholder="Title of your story" style="h1" label="Title" />
    <InputTextArea fieldId="content" style="h1" label="Story" info="some info here" />
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
      {formatInput}
      on:selected={handleTagSelected}
      on:inputsearch={debounce(handleTagSearch, 300)}
    />
  </div>
</section>
