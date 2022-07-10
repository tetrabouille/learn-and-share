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
  import type { FormOption } from '@/utils/form';
  import type { Story } from '@/types/story.type';
  import { STORY_GET_ALL } from '@/queries/story.query';
  import { getUrlFromParams } from '@/utils/commun';

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

  let params: {
    accountId: string;
  };
  $: params = $locationStore.params as typeof params;

  $: getFilters = () => {
    const filters = [];
    if (params.accountId) filters.push({ field: 'user.accountId', value: params.accountId });
    return filters;
  };

  $: storyGetAllQuery = query<{ stories: Story[] }, GetAllArgs>(STORY_GET_ALL, {
    variables: {
      filters: getFilters(),
      pagination: { take: 6 },
      sortList: [{ field: 'createdAt', order: 'desc' }],
    },
  });

  $: void storyGetAllQuery
    .refetch({
      filters: getFilters(),
    } as GetAllArgs)
    .then(() => {
      loading = false;
    });

  $: formContext = setFormContext({
    accountId: $locationStore.params.accountId,
  });

  $: formData = formContext.data;

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
    <h1 class="pb-5 text-3xl font-bold">{isOwn ? 'My stories' : 'Stories'}</h1>
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
  {#if $storyGetAllQuery.data?.stories?.length}
    <ul>
      {#each $storyGetAllQuery.data.stories as story}
        <li>{story.title}</li>
      {/each}
    </ul>
  {:else if $storyGetAllQuery.loading}
    loading
  {/if}
</section>
