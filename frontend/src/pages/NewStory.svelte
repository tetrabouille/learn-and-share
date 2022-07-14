<script lang="ts">
  import { mutation, query } from 'svelte-apollo';
  import { Link, navigate } from 'svelte-routing';
  import debounce from 'lodash/debounce';

  import { loggedUser } from '@/stores/auth.store';
  import { addAlert } from '@/stores/alert.store';
  import { setFormContext } from '@/contexts/form.context';
  import { TOPIC_GET_ALL } from '@/queries/topic.query';
  import { TAG_GET_ALL } from '@/queries/tag.query';
  import { PROFILE_UPDATE } from '@/queries/profile.query';
  import { STORY_ADD } from '@/queries/story.query';
  import InputTextArea from '@/components/forms/InputTextArea.svelte';
  import InputText from '@/components/forms/InputText.svelte';
  import InputSelect from '@/components/forms/InputSelect.svelte';
  import InputMultiSelect from '@/components/forms/InputMultiSelect.svelte';
  import SelectItems from '@/components/SelectItems.svelte';
  import Button from '@/components/Button.svelte';
  import Container from '@/components/Container.svelte';
  import { formatTitle, getLangNameFromCode, NEW_OPTION, type FormOption } from '@/utils/form';
  import { handleError } from '@/utils/errors';
  import { handleLangSelected, langsToOptions, updateLoggedUserLangs } from '@/utils/profile';
  import type { Item } from '@/components/SelectItems.svelte';
  import type { Topic } from '@/types/topic.type';
  import type { Tag } from '@/types/tag.type';
  import type { Filter, GetAllArgs } from '@/types/commun.type';
  import type { Profile, ProfilePayload } from '@/types/profile.type';
  import type { StoryAddArgs, StoryPayload } from '@/types/story.type';

  let tagGetAllVar: GetAllArgs = {
    pagination: { take: 6 },
    sortList: [{ field: 'createdAt', order: 'desc' }],
  };
  let profile: Profile;

  const profileUpdate = mutation<{ profileUpdate: ProfilePayload }>(PROFILE_UPDATE);

  $: profile = $loggedUser.user?.profile;

  $: tagGetAllVar.pagination.take = 6 + Number($data.tags.length);

  const storyAddMutation = mutation<{ storyAdd: StoryPayload }>(STORY_ADD);

  const topicGetAllQuery = query<{ topics: Topic[] }>(TOPIC_GET_ALL);
  const tagGetAllQuery = query<{ tags: Tag[] }, GetAllArgs>(TAG_GET_ALL, { variables: tagGetAllVar });

  const { data } = setFormContext({
    title: '',
    content: '',
    lesson: '',
    tags: [],
    topic: '',
  });

  const handleTagSearch = (e: CustomEvent<{ value: string }>) => {
    return tagGetAllQuery.refetch({
      filters: [{ field: 'name', value: e.detail.value, option: 'contains' } as Filter],
      ...tagGetAllVar,
    });
  };

  const handleFavLangSelected = ({ item, index }: { item: Item; index: number }) => {
    if (index === 0) return;
    handleLangSelected(item.id, profile, profileUpdate, updateLoggedUserLangs, navigate);
  };

  const handleSubmit = () => {
    const [tagIds, newTags] = $data.tags.reduce(
      (acc: unknown, tag: FormOption) => {
        if (tag.id.includes(NEW_OPTION)) {
          acc[1].push(tag.text);
        } else {
          acc[0].push(tag.id);
        }
        return acc;
      },
      [[], []]
    );

    storyAddMutation({
      variables: {
        input: {
          title: $data.title,
          content: $data.content,
          lesson: $data.lesson,
          topicId: $data.topic,
          tagIds,
          newTags,
        } as StoryAddArgs['input'],
      },
    })
      .then(handleError('Failed to add new story', 'storyAdd', navigate))
      .then(({ isError }) => {
        if (!isError) addAlert('Your story have been registered', 'success');
      })
      .catch(() => addAlert('Failed to add new story', 'error'));
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
  <form class="mb-80 flex flex-col items-center pt-10 md:px-5" on:submit|preventDefault={handleSubmit}>
    <h1 class="pb-5 text-3xl font-bold">Share your story</h1>
    {#if !profile.langs?.length}
      <Container>
        <h2 class="my-10 w-full text-center text-xl font-bold text-red-600">
          You need at least one language in your <Link to="profile" class="underline">profile</Link> to write a
          story
        </h2>
      </Container>
    {/if}
    <div class="mb-10 flex flex-col gap-x-4 lg:flex-row-reverse">
      <div class="flex flex-shrink flex-grow-0 flex-col">
        <Container extraClass="mb-8 lg:mb-[40px]">
          <h1 class="mb-2 text-2xl font-bold">How to write a good story</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur
            sagittis, nisl nunc consectetur nisi, euismod aliquet nisi nisl eget consectetur sagittis. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur sagittis,
            nisl nunc consectetur nisi, euismod aliquet nisi nisl eget consectetur sagittis. Lorem ipsum dolor
            sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur sagittis, nisl nunc
            consectetur nisi, euismod aliquet nisi nisl eget consectetur sagittis.
          </p>
        </Container>
        <Container rounded="sm" type="card" extraClass="md:mb-5 lg:mb-12">
          <h2 class="mb-1 text-xl font-bold">Choose your key words</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur
            sagittis, nisl nunc consectetur nisi, euismod aliquet nisi nisl eget consectetur sagittis. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur sagittis,
            nisl nunc consectetur nisi, euismod aliquet nisi nisl.
          </p>
        </Container>
        <Container rounded="sm" type="card" extraClass="mb-8">
          <h2 class="mb-1 text-xl font-bold">Find your Lesson</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur
            sagittis, nisl nunc consectetur nisi, euismod aliquet nisi nisl eget consectetur sagittis. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </Container>
      </div>
      <div class="flex w-full max-w-[770px] flex-grow flex-col">
        <Container rounded="lg" extraClass="p-5 pb-8 md:mb-8" type="input">
          <h2 class="mb-3 pl-4 text-xl">Title</h2>
          <InputText
            fieldId="title"
            placeholder="Title of your story"
            style="h1"
            disabled={!profile.langs?.length}
          />
          <h2 class="mb-3 pl-4 text-xl">Your story</h2>
          <InputTextArea
            fieldId="content"
            style="h1"
            placeholder="Share here"
            disabled={!profile.langs?.length}
          />
          <h2 class="mb-3 pl-4 text-xl">Key words</h2>
          <InputSelect
            fieldId="topic"
            style="h1"
            options={topics}
            placeholder="Select a topic"
            messageEmpty="No topics matches"
            disabled={!profile.langs?.length}
          />
          <InputMultiSelect
            fieldId="tags"
            style="h1"
            placeholder="Add/Select a tag"
            max={10}
            options={tags}
            formatInput={formatTitle}
            on:inputsearch={debounce(handleTagSearch, 300)}
            disabled={!profile.langs?.length}
          />
        </Container>
        <Container rounded="lg" extraClass="p-5 pb-8" type="input">
          <h2 class="mb-3 pl-4 text-2xl font-bold">Principle for Action</h2>
          <InputTextArea
            fieldId="lesson"
            style="h1"
            placeholder="The lesson of your story"
            disabled={!profile.langs?.length}
            rows={5}
          />
        </Container>
      </div>
    </div>
    <div class="flex w-full flex-col items-center justify-center gap-5 lg:flex-row-reverse">
      {#if profile.langs?.length}
        <Container rounded="sm" extraClass="lg:w-auto" type="card">
          <h2 class="text-xl">
            Language used for this story : <span class="font-bold"
              >{getLangNameFromCode(profile.langs[0])}</span
            >
          </h2>
          {#if profile.langs?.length > 1}
            <div class="mt-3 flex flex-wrap gap-1 lg:justify-center">
              <SelectItems
                items={langsToOptions(profile.langs)}
                on:select={(e) => handleFavLangSelected(e.detail)}
              />
            </div>
          {/if}
        </Container>
      {/if}
      <Button
        buttonClass="text-xl font-bold px-10 py-3 flex-shrink-0"
        type="submit"
        disabled={!profile.langs?.length}>Share your story</Button
      >
    </div>
  </form>
{/if}
