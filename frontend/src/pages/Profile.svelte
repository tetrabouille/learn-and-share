<script lang="ts">
  import { query } from 'svelte-apollo';
  import Fa from 'svelte-fa';
  import { faClose, faPen, faUserNinja, faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';

  import { loggedUser, setupLoggedUser } from '@/stores/auth.store';
  import { USER_GET } from '@/queries/user.query';
  import { getAge, getGender } from '@/utils/profile';
  import { uploadFile, onFileSelected, getUserFileName } from '@/utils/file';

  import type { User } from '@/types/user.type';
  import { addAlert } from '@/stores/alert.store';

  export let params;

  let hoverPicture = false;
  let avatarUrl: string;
  let avatarBlob: Blob;
  let fileinput: HTMLInputElement;
  let editMode = false;
  let loading = false;

  setupLoggedUser(query<{ user: User }>(USER_GET));

  const handleClickEdit = (valideChanges = false) => {
    editMode = !editMode;
    if (valideChanges && !editMode) {
      if (avatarBlob && avatarUrl !== 'loading') {
        loading = true;
        void uploadFile(avatarBlob, getUserFileName($loggedUser.user, 'avatar')).then(({ error, data }) => {
          loading = false;
          if (error) addAlert('Failed to upload picture', 'error');
          else {
            addAlert('Profile updated', 'success');
            // TODO: update user avatar
          }
        });
      }
    }
  };

  const handleFileChange = (fileUrl: string, blob: Blob) => {
    avatarUrl = fileUrl;
    avatarBlob = blob;
  };
</script>

<section class="flex flex-col items-center pt-10">
  {#if $loggedUser.isConnected && $loggedUser.user.validated}
    <div class="container max-w-[770px] rounded-lg bg-yellow-400/30 p-5">
      <div class="-mt-8 -mr-8 flex h-7 items-end justify-end gap-2">
        {#if loading}
          <div class="flex h-full w-7 items-center justify-center rounded-full bg-yellow-400 text-sm">
            <Fa icon={faSpinner} pulse />
          </div>
        {:else if !editMode}
          <button
            class="flex h-full w-7 items-center justify-center rounded-full bg-yellow-400 text-sm"
            on:click={() => handleClickEdit()}><Fa icon={faPen} /></button
          >
        {:else}
          <button
            class="flex grow-0 h-full w-7 items-center justify-center rounded-full bg-green-400 text-sm"
            on:click={() => handleClickEdit(true)}><Fa icon={faCheck} /></button
          >
          <button
            class="flex grow-0 h-full w-7 items-center justify-center rounded-full bg-red-400 text-sm"
            on:click={() => handleClickEdit(false)}><Fa icon={faClose} /></button
          >
        {/if}
      </div>
      <header class="flex justify-between">
        <div>
          <h1 class="text-2xl">{$loggedUser.user.profile?.firstname} {$loggedUser.user.profile?.lastname}</h1>
          {#if $loggedUser.user.profile?.birthdate}
            <p>{getAge($loggedUser.user.profile.birthdate)}</p>
          {/if}
          {#if $loggedUser.user.profile?.gender}
            <p>{getGender($loggedUser.user.profile.gender)}</p>
          {/if}
        </div>
        <div
          title={editMode ? 'Change your profile picture' : 'Your avatar'}
          class="flex h-[150px] w-[150px] items-center justify-center rounded-full bg-yellow-400/70 text-3xl text-cold-800"
          class:cursor-pointer={editMode}
          on:mouseenter={() => (hoverPicture = true)}
          on:mouseleave={() => (hoverPicture = false)}
          on:click={() => {
            editMode && fileinput.click();
          }}
        >
          {#if avatarUrl === 'loading'}
            <Fa icon={faSpinner} pulse />
          {:else if editMode && hoverPicture}
            <Fa icon={faPen} class="text-xl" />
          {:else if avatarUrl}
            <img class="h-full w-full rounded-full" alt="avatar" src={avatarUrl} />
          {:else}
            <Fa icon={faUserNinja} />
          {/if}
          <input
            class="hidden"
            type="file"
            accept=".jpg, .jpeg, .png"
            on:change={(e) => onFileSelected(e, handleFileChange)}
            bind:this={fileinput}
          />
        </div>
      </header>
      {#if $loggedUser.user.profile?.bio}
        <p class="mt-5 text-lg">
          {$loggedUser.user.profile.bio}
        </p>
      {/if}
    </div>
  {:else}
    <p>User not connected or not validated</p>
  {/if}
</section>
