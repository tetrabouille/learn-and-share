<script lang="ts">
  import { mutation, query } from 'svelte-apollo';

  import Container from '@/components/Container.svelte';
  import BorderButtons from '@/components/BorderButtons.svelte';
  import Avatar from '@/components/Avatar.svelte';
  import { getLangNameFromCode } from '@/utils/form';
  import { clickOutside } from '@/actions/click_outside';
  import type { Story, StoryPayload } from '@/types/story.type';
  import type { Option as OptionBorderButtons } from '@/components/BorderButtons.svelte';
  import { setFormContext } from '@/contexts/form.context';
  import type { Topic } from '@/types/topic.type';
  import type { Tag } from '@/types/tag.type';
  import type { GetAllArgs } from '@/types/commun.type';
  import { TOPIC_GET_ALL } from '@/queries/topic.query';
  import { TAG_GET_ALL } from '@/queries/tag.query';
  import { STORY_PUBLISH, STORY_UPDATE } from '@/queries/story.query';
  import { getPaginationQueryVar } from '@/utils/commun';
  import { addAlert } from '@/stores/alert.store';

  export let story: Story;
  export let refetchStories: () => Promise<void> = () => undefined;
  export let loading = false;

  let askPublish = false;
  let editMode = false;

  $: formContext = setFormContext(
    {
      title: story.title,
      content: story.content,
      lesson: story.lesson,
      lang: story.lang,
      topic: story.topic.id,
      tags: story.tags?.map((tag) => tag.id) || [],
    },
    `form-story-${story.id}`
  );

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

  const topicGetAllQuery = query<{ topics: Topic[] }>(TOPIC_GET_ALL);

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

  $: tagGetAllVar = getPaginationQueryVar({ take: 6 });
  const tagGetAllQuery = query<{ tags: Tag[] }, GetAllArgs>(TAG_GET_ALL, { variables: tagGetAllVar });

  $: topics = $topicGetAllQuery.data?.topics?.map(({ id, name }) => ({
    id: String(id),
    text: name,
  }));

  $: tags = $tagGetAllQuery.data?.tags?.map(({ id, name }) => ({
    id: String(id),
    text: name,
  }));
</script>

<svelte:window
  on:scroll={() => {
    editMode = false;
    askPublish = false;
  }}
/>

<Container type={story.isOwn && !story.published ? 'input' : 'card'} extraClass="mb-8">
  {#if story.isOwn && !story.published}
    {#if askPublish}
      <div
        use:clickOutside
        on:outclick={() => {
          editMode = false;
          askPublish = false;
        }}
      >
        <BorderButtons {loading} styleContainer="justify-end" options={optionsPublish} />
      </div>
    {:else}
      <BorderButtons {loading} styleContainer="justify-end" {options} />
    {/if}
  {/if}
  <div class="flex flex-col gap-x-5 sm:flex-row">
    <div class="flex-grow">
      <h2 class="text-xl font-bold">
        {story.title}
      </h2>
      <p class="pb-2 text-sm text-warm-800/70">({getLangNameFromCode(story.lang)})</p>
      {#if story.topic}<p class="pb-2 underline">{story.topic.name}</p>{/if}
      {#if story?.tags?.length}
        <div class="flex flex-wrap gap-2 pb-4 text-sm">
          {#each story?.tags || [] as tag}
            <span class="inline-block rounded-full bg-brown-800/80 px-2 text-white">{tag.name}</span>
          {/each}
        </div>
      {/if}
      <p class="pb-5">{story.content}</p>
      <h2 class="pb-1 text-xl">Lesson</h2>
      <p>{story.lesson}</p>
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
