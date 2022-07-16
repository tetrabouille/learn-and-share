<script lang="ts">
  import { mutation, query } from 'svelte-apollo';
  import { navigate } from 'svelte-routing';

  import Container from '@/components/Container.svelte';
  import BorderButtons from '@/components/BorderButtons.svelte';
  import Avatar from '@/components/Avatar.svelte';
  import InputText from '@/components/forms/InputText.svelte';
  import InputSelect from '@/components/forms/InputSelect.svelte';
  import InputTextArea from '@/components/forms/InputTextArea.svelte';
  import InputMultiSelect from '@/components/forms/InputMultiSelect.svelte';
  import { clickOutside } from '@/actions/click_outside';
  import type { Story, StoryAddArgs, StoryPayload } from '@/types/story.type';
  import type { Option as OptionBorderButtons } from '@/components/BorderButtons.svelte';
  import { setFormContext } from '@/contexts/form.context';
  import type { Topic } from '@/types/topic.type';
  import type { Tag } from '@/types/tag.type';
  import type { GetAllArgs } from '@/types/commun.type';
  import { addAlert } from '@/stores/alert.store';
  import { TOPIC_GET_ALL } from '@/queries/topic.query';
  import { TAG_GET_ALL } from '@/queries/tag.query';
  import { STORY_PUBLISH, STORY_UPDATE } from '@/queries/story.query';
  import { formatTitle, getLangNameFromCode, getLangOptions } from '@/utils/form';
  import { getPaginationQueryVar } from '@/utils/commun';
  import { handleError } from '@/utils/errors';
  import { getSearchTagsFilter, getTagIdsAndNewTags, getTagOptions } from '@/utils/tag';

  export let story: Story;
  export let refetchStories: () => Promise<void> = () => undefined;
  export let loading = false;

  const formContextKey = `form-story-${story.id}`;

  let searchLangInput = '';
  let askPublish = false;
  let editMode = false;

  const options: OptionBorderButtons[] = [
    {
      id: 'publish',
      icon: 'submit',
      style: 'bg-green-400/90',
      handleClick() {
        askPublish = true;
      },
    },
    {
      id: 'edit',
      icon: 'pen',
      style: 'bg-yellow-400/90',
      handleClick() {
        editMode = true;
      },
    },
  ];

  const optionsEdit: OptionBorderButtons[] = [
    {
      id: 'update',
      icon: 'check',
      style: 'bg-green-400/90',
      handleClick() {
        handleUpdate();
        editMode = false;
      },
    },
    {
      id: 'cancel',
      icon: 'close',
      style: 'bg-red-400/90',
      handleClick() {
        editMode = false;
      },
    },
  ];

  const optionsPublish: OptionBorderButtons[] = [
    {
      id: 'ask',
      text: 'Share to the world? This can not be undone',
      style: 'bg-yellow-400/90 w-full sm:w-auto',
    },
    {
      id: 'publish',
      icon: 'check',
      style: 'bg-green-400/90',
      handleClick() {
        handlePublish();
        askPublish = true;
      },
    },
    {
      id: 'cancel',
      icon: 'close',
      style: 'bg-red-400/90',
      handleClick() {
        askPublish = false;
      },
    },
  ];

  $: defaultData = {
    title: story.title,
    content: story.content,
    lesson: story.lesson,
    lang: story.lang,
    topic: story.topic.id,
    tags: getTagOptions(story.tags),
  };

  const { data } = setFormContext(defaultData, formContextKey);

  const handleLangSearch = (e: CustomEvent<{ value: string }>) => {
    searchLangInput = e.detail.value;
  };

  const handleTagSearch = (e: CustomEvent<{ value: string }>) => {
    return tagGetAllQuery.refetch({
      filters: getSearchTagsFilter(e.detail.value),
      ...tagGetAllVar,
    });
  };

  $: storyPublish = mutation<{ storyPublish: StoryPayload }>(STORY_PUBLISH);
  $: storyUpdate = mutation<{ storyUpdate: StoryPayload }>(STORY_UPDATE);

  $: handlePublish = async () => {
    try {
      loading = true;
      await storyPublish({ variables: { id: story.id } });
      await refetchStories();
      addAlert('Story shared to the world!', 'success');
    } catch (e) {
      addAlert('Failed to publish story', 'error');
    } finally {
      loading = false;
      askPublish = false;
    }
  };

  $: handleUpdate = async () => {
    try {
      loading = true;
      const [tagIds, newTags] = getTagIdsAndNewTags($data.tags);

      await storyUpdate({
        variables: {
          id: story.id,
          input: {
            title: $data.title,
            content: $data.content,
            lesson: $data.lesson,
            lang: $data.lang,
            topicId: $data.topic,
            tagIds,
            newTags,
          },
        } as StoryAddArgs['input'],
      }).then(handleError('Failed to update story', 'storyUpdate', navigate));

      await refetchStories();
    } catch (e) {
      addAlert('Failed to update story', 'error');
    } finally {
      loading = false;
      askPublish = false;
    }
  };

  $: data.set(defaultData);

  $: tagGetAllVar = getPaginationQueryVar({ take: 6 + Number($data.tags.length) });
  const tagGetAllQuery = query<{ tags: Tag[] }, GetAllArgs>(TAG_GET_ALL, { variables: tagGetAllVar });

  $: topicOptions = $topicGetAllQuery.data?.topics?.map(({ id, name }) => ({
    id: String(id),
    text: name,
  }));

  const topicGetAllQuery = query<{ topics: Topic[] }>(TOPIC_GET_ALL);
  $: tagOptions = $tagGetAllQuery.data?.tags?.map(({ id, name }) => ({
    id: String(id),
    text: name,
  }));

  $: langOptions = getLangOptions(searchLangInput, $data.lang);
</script>

<svelte:window
  on:scroll={() => {
    askPublish = false;
  }}
/>

<Container type={editMode ? 'input' : 'card'} extraClass="mb-8">
  {#if story.isOwn && !story.published}
    {#if askPublish}
      <div
        use:clickOutside
        on:outclick={() => {
          askPublish = false;
        }}
      >
        <BorderButtons {loading} styleContainer="justify-end" options={optionsPublish} />
      </div>
    {:else if editMode}
      <BorderButtons {loading} styleContainer="justify-end" options={optionsEdit} />
    {:else}
      <BorderButtons {loading} styleContainer="justify-end" {options} />
    {/if}
  {/if}
  <div class="flex flex-col gap-x-5 sm:flex-row">
    <div class="flex-grow">
      {#if editMode}
        <InputText fieldId="title" style="h1" {formContextKey} label="Title" />
      {:else}
        <h2 class="text-xl font-bold">
          {story.title}
        </h2>
      {/if}
      {#if editMode}
        <InputSelect
          fieldId="lang"
          {formContextKey}
          label="Language"
          options={langOptions}
          formatInput={formatTitle}
          on:inputsearch={handleLangSearch}
          style="h1"
        />
      {:else}
        <p class="pb-2 text-sm text-warm-800/70">({getLangNameFromCode(story.lang)})</p>
      {/if}

      {#if editMode}
        <InputSelect fieldId="topic" {formContextKey} label="Topic" options={topicOptions} style="h1" />
      {:else if story.topic}
        <p class="pb-2 underline">{story.topic.name}</p>
      {/if}
      {#if editMode}
        <InputMultiSelect
          fieldId="tags"
          {formContextKey}
          label="Tags"
          options={tagOptions}
          formatInput={formatTitle}
          on:inputsearch={handleTagSearch}
          style="h1"
          placeholder="Add/Search tags"
        />
      {:else if story?.tags?.length}
        <div class="flex flex-wrap gap-2 pb-4 text-sm">
          {#each story?.tags || [] as tag}
            <span class="inline-block rounded-full bg-brown-800/80 px-2 text-white">{tag.name}</span>
          {/each}
        </div>
      {/if}
      {#if editMode}
        <InputTextArea fieldId="content" {formContextKey} label="Content" style="h1" rows={6} />
      {:else}
        <p class="pb-5">{story.content}</p>
      {/if}
      {#if editMode}
        <InputTextArea fieldId="lesson" {formContextKey} label="Lesson" style="h1" rows={4} />
      {:else}
        <h2 class="pb-1 text-xl">Lesson</h2>
        <p>{story.lesson}</p>
      {/if}
    </div>
    <div class="mx-auto mt-3 flex flex-col items-center justify-center self-start">
      <div class="h-[70px] w-[70px] sm:h-[150px] sm:w-[150px]">
        <Avatar avatarUrl={story.user.profile.avatarUrl} lang={story.user.profile.langs?.[0]} />
      </div>
      <div class="whitespace-nowrap text-center">
        {story.user.profile.firstname || ''}
        {story.user.profile.lastname || ''}
      </div>
    </div>
  </div>
</Container>
