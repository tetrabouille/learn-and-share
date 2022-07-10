<script lang="ts">
  import { navigate } from 'svelte-routing';
  import { query } from 'svelte-apollo';

  import { loggedUser } from '@/stores/auth.store';
  import { locationStore } from '@/stores/location.store';
  import { setFormContext } from '@/contexts/form.context';
  import { USER_GET_ALL } from '@/queries/user.query';
  import InputSelect from '@/components/forms/InputSelect.svelte';
  import Button from '@/components/Button.svelte';
  import type { User } from '@/types/user.type';
  import type { GetAllArgs } from '@/types/commun.type';
  import { getLangNameFromCode, type FormOption } from '@/utils/form';
  import type { Story } from '@/types/story.type';
  import { getStoryGetAll } from '@/queries/story.query';
  import { getUrlFromParams } from '@/utils/commun';
  import { addAvatarToProfile } from '@/utils/profile';
  import Container from '@/components/Container.svelte';
  import Avatar from '@/components/Avatar.svelte';

  const STORY_GET_ALL = getStoryGetAll(`
      user { id accountId profile { id avatarUrl langs firstname lastname } }
  `);

  const userGetAllQuery = query<{ users: User[] }, GetAllArgs>(USER_GET_ALL, {
    variables: {
      pagination: { take: 50 },
      sortList: [{ field: 'createdAt', order: 'desc' }],
    },
  });

  let usersOptions: FormOption[];
  $: usersOptions = ($userGetAllQuery.data?.users || []).map((user) => ({
    id: user.accountId,
    text: `${user.profile.firstname} ${user.profile.lastname}`,
  }));
  $: usersOptions.unshift({ id: undefined, text: 'All' });

  $: formContext = setFormContext({
    accountId: $locationStore.params.accountId,
  });

  $: formData = formContext.data;

  let params: {
    accountId: string;
  };
  $: params = $locationStore.params as typeof params;

  $: getFilters = () => {
    const filters = [];
    if (params.accountId) filters.push({ field: 'user.accountId', value: params.accountId });
    else filters.push({ field: 'published', value: 'true', type: 'boolean' });
    return filters;
  };

  $: storyGetAllQuery = query<{ stories: Story[] }, GetAllArgs>(STORY_GET_ALL, {
    variables: {
      filters: getFilters(),
      pagination: { take: 6 },
      sortList: [
        { field: 'published', order: 'asc' },
        { field: 'createdAt', order: 'desc' },
      ],
    },
  });

  $: void storyGetAllQuery
    .refetch({
      filters: getFilters(),
    } as GetAllArgs)
    .then(() => {
      loading = false;
    });

  $: storiesTab = ($storyGetAllQuery.data?.stories || [])
    .map((story) => ({
      ...story,
      user: { ...story.user, profile: addAvatarToProfile(story.user) },
    }))
    .reduce(
      (acc, story) => {
        if (!story.published) acc[0].push(story);
        else acc[1].push(story);
        return acc;
      },
      [[], []]
    );

  let loading = true;
  $: loading = $userGetAllQuery.loading || $storyGetAllQuery.loading;

  $: isOwn = $loggedUser.isConnected ? params.accountId === $loggedUser.user.accountId : false;

  $: handleSubmit = () => {
    loading = true;
    const url = getUrlFromParams('/stories', { accountId: $formData.accountId });
    navigate(url);
  };
</script>

<section class="flex flex-col items-center pt-10">
  <form class="flex w-full flex-col items-center" on:submit|preventDefault={handleSubmit}>
    <div class="container mb-10 max-w-[770px] bg-yellow-400/20 p-5 md:rounded-md md:shadow-md">
      <h2 class="mb-3 pl-4 text-xl">Search a story</h2>
      {#key { usersOptions, params }}
        <InputSelect
          label="Author"
          placeholder="Select an author"
          style="h1"
          fieldId="accountId"
          options={usersOptions}
          messageEmpty="No writer found"
        />
      {/key}
      <Button buttonClass="text-xl mx-auto mt-1" {loading} type="submit">Search</Button>
    </div>
  </form>
  <h1 class="pb-5 text-3xl font-bold">{isOwn ? 'My stories' : 'Stories'}</h1>
  {#each storiesTab as stories, index}
    {#if stories.length}
      <div class="container flex max-w-[770px] gap-4 text-center text-warm-600/80">
        {#if isOwn}
          <div class="my-auto h-full flex-grow border-b-2" />
          {#if index === 0}
            <h2 class="py-3 text-lg text-warm-900/90">Drafts</h2>
          {/if}
          {#if index === 1}
            <h2 class="py-3 text-lg text-warm-900/90">Published</h2>
          {/if}
          <div class="my-auto h-full flex-grow border-b-2" />
        {/if}
      </div>
      <div class="flex w-full flex-col items-center">
        {#each stories as story}
          <Container
            isInput={story.isOwn && !story.published}
            extraClass="mb-8 flex flex-col sm:flex-row gap-x-5"
          >
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
          </Container>
        {/each}
      </div>
    {:else if $storyGetAllQuery.loading}
      loading
    {/if}
  {/each}
</section>
