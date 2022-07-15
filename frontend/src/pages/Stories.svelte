<script lang="ts">
  import { navigate } from 'svelte-routing';
  import { query } from 'svelte-apollo';
  import { faSearch } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  import { loggedUser } from '@/stores/auth.store';
  import { locationStore } from '@/stores/location.store';
  import { setFormContext } from '@/contexts/form.context';
  import { USER_GET_ALL } from '@/queries/user.query';
  import InputSelect from '@/components/forms/InputSelect.svelte';
  import Button from '@/components/Button.svelte';
  import type { User } from '@/types/user.type';
  import type { GetAllArgs } from '@/types/commun.type';
  import type { FormOption } from '@/utils/form';
  import type { Story } from '@/types/story.type';
  import { getStoryGetAll } from '@/queries/story.query';
  import { getUrlFromParams } from '@/utils/commun';
  import { addAvatarToProfile } from '@/utils/profile';
  import Container from '@/components/Container.svelte';
  import StoryCard from '@/components/story/StoryCard.svelte';
  import { addAlert } from '@/stores/alert.store';

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
      pagination: { take: 50 },
      sortList: [
        { field: 'published', order: 'asc' },
        { field: 'createdAt', order: 'desc' },
      ],
    },
  });

  $: refetchStories = () =>
    storyGetAllQuery
      .refetch({
        filters: getFilters(),
      } as GetAllArgs)
      .then(() => {
        loading = false;
      })
      .catch(() => {
        addAlert('Failed to fetch stories', 'error');
      });
  $: refetchStories();

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
        {#each stories as story (story.id)}
          <StoryCard {story} {loading} {refetchStories} />
        {/each}
      </div>
    {/if}
  {/each}
  {#if $storyGetAllQuery.loading}
    <p class="text-xl">Loading stories</p>
  {:else if !storiesTab[0].length && !storiesTab[1].length}
    <Container extraClass="flex flex-col items-center py-5 text-xl" type="card">
      <Fa icon={faSearch} class="mb-2" />
      <p>No stories found, try a different search</p>
    </Container>
  {/if}
</section>
