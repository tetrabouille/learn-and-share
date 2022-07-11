<script lang="ts">
  import { mutation } from 'svelte-apollo';
  import Fa from 'svelte-fa';
  import { navigate } from 'svelte-routing';
  import { faPen, faSpinner, faWarning } from '@fortawesome/free-solid-svg-icons';
  import { all as locales } from 'locale-codes';
  import country from 'country-list';

  import { loggedUser } from '@/stores/auth.store';
  import { setFormContext } from '@/contexts/form.context';
  import { addAlert } from '@/stores/alert.store';
  import { PROFILE_UPDATE } from '@/queries/profile.query';
  import {
    getAge,
    getGenderLabel,
    getGenderOptions,
    getGenderCode,
    getCustomGender,
    handleLangSelected,
    langsToOptions,
    updateLoggedUserLangs,
  } from '@/utils/profile';
  import { uploadFile, onFileSelected, getUserFileName } from '@/utils/file';
  import { dateFromTimestamp } from '@/utils/date';
  import { formatTitle } from '@/utils/form';
  import InputText from '@/components/forms/InputText.svelte';
  import InputDate from '@/components/forms/InputDate.svelte';
  import InputSelect from '@/components/forms/InputSelect.svelte';
  import InputTextArea from '@/components/forms/InputTextArea.svelte';
  import InputMultiSelect from '@/components/forms/InputMultiSelect.svelte';
  import Avatar from '@/components/Avatar.svelte';
  import SelectItems, { type Item } from '@/components/SelectItems.svelte';
  import { handleError } from '@/utils/errors';
  import { GenderEnum, type Profile, type ProfilePayload } from '@/types/profile.type';
  import Container from '@/components/Container.svelte';
  import BorderButtons from '@/components/BorderButtons.svelte';

  export let params;

  let hoverPicture = false;
  let profile: Profile;
  let avatarUrl: string;
  let avatarBlob: Blob;
  let fileinput: HTMLInputElement;
  let editMode = false;
  let loading = false;
  let searchLangInput = '';
  let searchCountryInput = '';
  let isCustomGender = false;

  const localesFiltered = locales.filter(({ tag }) => !tag.includes('-'));

  $: avatarUrl = $loggedUser.user?.profile?.avatarUrl;

  $: profile = $loggedUser.user?.profile;

  $: defaultData = {
    firstname: profile?.firstname || '',
    lastname: profile?.lastname || '',
    birthdate: dateFromTimestamp(profile?.birthdate),
    gender: getGenderCode(profile?.gender),
    country: profile?.country,
    customGender: getCustomGender(profile?.gender),
    bio: profile?.bio || '',
    langs: langsToOptions(profile?.langs),
  };

  $: formContext = setFormContext({ ...defaultData });

  $: data = formContext?.data;

  $: isCustomGender = $data?.gender === GenderEnum.C;

  const profileUpdate = mutation<{ profileUpdate: ProfilePayload }>(PROFILE_UPDATE);

  const handleClickEdit = async (valideChanges = false) => {
    editMode = !editMode;
    if (valideChanges && !editMode) {
      loading = true;

      let newAvatarUrl: string;
      if (avatarBlob && avatarUrl !== 'loading') {
        const { error, data } = await uploadFile(avatarBlob, getUserFileName($loggedUser.user, 'avatar'));
        if (error) {
          loading = false;
          return addAlert(`Failed to upload picture`, 'error');
        }
        newAvatarUrl = data?.Key;
      }

      try {
        const payload = await profileUpdate({
          variables: {
            id: $loggedUser.user?.profile?.id,
            input: {
              avatarUrl: newAvatarUrl,
              firstname: $data.firstname,
              lastname: $data.lastname,
              birthdate: $data.birthdate,
              gender: $data.gender === GenderEnum.C ? $data.customGender : $data.gender,
              country: $data.country,
              bio: $data.bio,
              langs: $data.langs.map((l) => l.id),
            },
          },
        }).then(handleError('Failed to update profile', 'profileUpdate', navigate));

        loading = false;
        if (!payload.isError) addAlert(`Profile updated`, 'success');
        else data.set({ ...defaultData });
      } catch (e) {
        loading = false;
        data.set({ ...defaultData });
        addAlert('Failed to update profile', 'error');
      }
    } else if (!editMode) {
      data.set({ ...defaultData });
      avatarUrl = $loggedUser.user?.profile?.avatarUrl;
      avatarBlob = null;
      fileinput.value = '';
    }
  };

  const handleBB = (id: string) => {
    switch (id) {
      case 'edit':
        return handleClickEdit();
      case 'submit':
        return handleClickEdit(true);
      case 'cancel':
        return handleClickEdit(false);
    }
  };

  const handleFileChange = (fileUrl: string, blob: Blob) => {
    avatarUrl = fileUrl;
    avatarBlob = blob;
  };

  const handleTagSearch = (e: CustomEvent<{ value: string }>) => {
    searchLangInput = e.detail.value;
  };

  const handleCountrySearch = (e: CustomEvent<{ value: string }>) => {
    searchCountryInput = e.detail.value;
  };

  const handleFavLangSelected = ({ item, index }: { item: Item; index: number }) => {
    if (index === 0) return;
    const langId = item.id;
    handleLangSelected(langId, profile, profileUpdate, updateLoggedUserLangs, navigate);
  };

  $: getLangOptions = () => {
    return localesFiltered
      .filter((l) => l.name.toLowerCase().includes(searchLangInput.toLowerCase()))
      .map((l) => ({
        id: l.tag,
        text: l.name,
      }))
      .slice(0, 20);
  };

  $: getCountryOptions = () => {
    const current = $data.country
      ? {
          id: $data.country,
          text: country.getName($data.country),
        }
      : null;

    const opts = country
      .getData()
      .filter((c) => c.name.toLowerCase().includes(searchCountryInput.toLowerCase()))
      .map((c) => ({
        id: c.code,
        text: c.name,
      }))
      .slice(0, 20);

    if (current && !opts.find(({ id }) => id === current.id)) opts.unshift(current);
    return opts;
  };
</script>

<section class="flex flex-col items-center pt-10">
  {#if $loggedUser.isConnected && $loggedUser.user.validated && $data}
    <h1 class="pb-5 text-3xl font-bold">My profile</h1>
    <Container isInput={editMode} extraClass="p-5">
      {#if !editMode}
        <BorderButtons
          {loading}
          styleContainer="justify-end"
          options={[{ id: 'edit', icon: 'pen', style: 'bg-yellow-400', handleClick: handleBB }]}
        />
      {:else}
        <BorderButtons
          {loading}
          styleContainer="justify-end"
          options={[
            { id: 'submit', icon: 'check', style: 'bg-green-400', handleClick: handleBB },
            { id: 'cancel', icon: 'close', style: 'bg-red-400', handleClick: handleBB },
          ]}
        />
      {/if}
      <div class={`flex flex-col-reverse justify-between gap-5 ${editMode ? 'md:flex-row' : 'xs:flex-row'}`}>
        <div class="md:max-w-[495px]">
          {#if editMode}
            <div class="flex flex-col items-center gap-x-3 xs:flex-row">
              <InputText fieldId="firstname" style="h1" placeholder="Firstname" label="Firstname" />
              <InputText fieldId="lastname" style="h1" placeholder="Lastname" label="Lastname" />
            </div>
          {:else}
            <h1 class="text-2xl font-bold">
              {$data.firstname}
              {$data.lastname}
            </h1>
          {/if}
          {#if editMode}
            <InputDate fieldId="birthdate" placeholder="Birthdate" style="h1" label="Birthdate" />
          {:else if $data.birthdate}
            <p>{getAge($data.birthdate)}</p>
          {/if}
          {#if editMode}
            <div class="flex flex-col items-end gap-x-3 sm:flex-row">
              <InputSelect
                fieldId="gender"
                style="h1"
                options={getGenderOptions()}
                placeholder="Select your gender"
                label="Gender"
              />
              {#if isCustomGender}
                <InputText fieldId="customGender" style="h1" placeholder="Tell your gender" />
              {/if}
            </div>
          {:else if getGenderLabel($data.gender, $data.customGender)}
            <p>{getGenderLabel($data.gender, $data.customGender)}</p>
          {/if}
          {#if editMode}
            <InputSelect
              fieldId="country"
              style="h1"
              on:inputsearch={handleCountrySearch}
              formatInput={formatTitle}
              options={getCountryOptions()}
              placeholder="Select where you live"
              label="Country"
            />
          {:else if country.getName($data.country || '')}
            <p>{country.getName($data.country || '')}</p>
          {/if}
        </div>
        <div class={`flex grow items-center justify-center ${!editMode ? 'sm:justify-end' : '-mr-5'}`}>
          <div
            title={editMode ? 'Change your avatar' : 'Your avatar'}
            class="h-[150px]"
            class:cursor-pointer={editMode}
            on:mouseenter={() => (hoverPicture = true)}
            on:mouseleave={() => (hoverPicture = false)}
            on:click={() => {
              editMode && fileinput.click();
            }}
          >
            <div
              class="flex h-full w-[150px] items-center justify-center rounded-full bg-yellow-400 text-3xl text-cold-800"
            >
              {#if avatarUrl === 'loading'}
                <Fa icon={faSpinner} pulse />
              {:else if editMode && hoverPicture}
                <Fa icon={faPen} class="text-xl" />
              {:else}
                <Avatar
                  {avatarUrl}
                  lang={$data?.langs?.[0]?.id}
                  firstname={$data?.firstname}
                  lastname={$data?.lastname}
                />
              {/if}
              <input
                class="hidden"
                type="file"
                accept=".jpg, .jpeg, .png"
                on:change={(e) => onFileSelected(e, handleFileChange)}
                bind:this={fileinput}
              />
            </div>
          </div>
        </div>
      </div>
      {#if editMode}
        <InputMultiSelect
          fieldId="langs"
          style="h1"
          options={getLangOptions()}
          on:inputsearch={handleTagSearch}
          placeholder={!$data.langs?.length ? 'Select the languages you know' : ''}
          messageEmpty="No languages found"
          messageMax="Maximum languages reached"
          formatInput={formatTitle}
          addNewTags={false}
          label="Languages spoken"
        />
      {:else if $data.langs?.length}
        <h1 class="mt-5 text-2xl">Languages</h1>
        <SelectItems items={$data.langs} on:select={(e) => handleFavLangSelected(e.detail)} />
      {:else}
        <div class="text-red-600 flex items-center gap-x-2">
          <Fa icon={faWarning} />
          <span class="text-xl hover:underline cursor-pointer" on:click={() => handleClickEdit(true)}
            >Add languages to share stories</span
          >
        </div>
      {/if}
      {#if editMode}
        <InputTextArea fieldId="bio" style="h1" label="About me" />
      {:else if $data.bio}
        <h1 class="mt-5 text-2xl">About me</h1>
        <p class="text-lg">
          {$data.bio}
        </p>
      {/if}
    </Container>
  {:else}
    <p>User not connected or not validated</p>
  {/if}
</section>
