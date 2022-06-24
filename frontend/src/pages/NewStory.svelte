<script lang="ts">
  import { mutation, query } from 'svelte-apollo';
  import { Link, navigate } from 'svelte-routing';
  import debounce from 'lodash/debounce';

  import { loggedUser } from '@/stores/auth.store';
  import { addAlert } from '@/stores/alert.store';
  import { setFormContext } from '@/contexts/form.context';
  import { TOPIC_GET_ALL } from '@/queries/topic.query';
  import { TAG_ADD, TAG_GET_ALL } from '@/queries/tag.query';
  import { PROFILE_UPDATE } from '@/queries/profile.query';
  import InputTextArea from '@/components/forms/InputTextArea.svelte';
  import InputText from '@/components/forms/InputText.svelte';
  import InputSelect from '@/components/forms/InputSelect.svelte';
  import InputMultiSelect from '@/components/forms/InputMultiSelect.svelte';
  import SelectItems from '@/components/SelectItems.svelte';
  import { formatTitle, getLangNameFromCode, type FormOption } from '@/utils/form';
  import { handleError } from '@/utils/errors';
  import { handleLangSelected, langsToOptions, updateLoggedUserLangs } from '@/utils/profile';
  import type { Topic } from '@/types/topic.type';
  import type { Tag } from '@/types/tag.type';
  import type { TagPayload } from '@/types/tag.type';
  import type { GetAllArgs } from '@/types/commun.type';
  import type { Profile, ProfilePayload } from '@/types/profile.type';
  import type { Item } from '@/components/SelectItems.svelte';

  let tagGetAllVar: GetAllArgs = {
    pagination: { take: 6 },
    sortList: [{ field: 'createdAt', order: 'desc' }],
  };
  let profile: Profile;

  const profileUpdate = mutation<{ profileUpdate: ProfilePayload }>(PROFILE_UPDATE);

  $: profile = $loggedUser.user?.profile;

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

  const handleFavLangSelected = ({ item, index }: { item: Item; index: number }) => {
    if (index === 0) return;
    handleLangSelected(item.id, profile, profileUpdate, updateLoggedUserLangs, navigate);
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

{#if $loggedUser.isConnected}
  <section class="flex flex-col items-center pt-10">
    <h1 class="pb-5 text-3xl font-bold">Share your story</h1>
    <div class="container mb-8 max-w-[770px] rounded-lg bg-yellow-400/30 p-5">
      {#if !profile.langs?.length}
        <h2 class="text-xl text-red-600">
          You need at least one language in your <Link to="profile" class="underline">profile</Link> to write a
          story
        </h2>
      {:else}
        <h2 class="text-xl">
          Language used for this story : <span class="font-bold">{getLangNameFromCode(profile.langs[0])}</span
          >
        </h2>
        {#if profile.langs?.length > 1}
          <div class="mt-3 flex flex-wrap gap-1">
            <SelectItems
              items={langsToOptions(profile.langs)}
              on:select={(e) => handleFavLangSelected(e.detail)}
            />
          </div>
        {/if}
      {/if}
    </div>
    <div class="container max-w-[770px] rounded-lg bg-yellow-400/30 p-5">
      <h2 class="mb-3 pl-4 text-xl">Title</h2>
      <InputText fieldId="title" placeholder="Title of your story" style="h1" />
      <h2 class="mb-3 pl-4 text-xl">Key words</h2>
      <InputSelect
        fieldId="topic"
        style="h1"
        options={topics}
        placeholder="Select a topic"
        messageEmpty="No topics matches"
      />
      <InputMultiSelect
        fieldId="tags"
        style="h1"
        placeholder="Add/Select a tag"
        max={3}
        options={tags}
        formatInput={formatTitle}
        on:selected={handleTagSelected}
        on:inputsearch={debounce(handleTagSearch, 300)}
      />
      <h2 class="mb-3 pl-4 text-xl">Your story</h2>
      <InputTextArea fieldId="content" style="h1" placeholder="Share here" />
    </div>
  </section>
{/if}
