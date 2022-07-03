<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Link, navigate } from 'svelte-routing';
  import { slide } from 'svelte/transition';
  import { mutation } from 'svelte-apollo';
  import Fa from 'svelte-fa';
  import { faExchange } from '@fortawesome/free-solid-svg-icons';
  import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';

  import Avatar from '@/components/Avatar.svelte';
  import Button from '@/components/Button.svelte';
  import { loggedUser } from '@/stores/auth.store';
  import { handleLangSelected, updateLoggedUserLangs } from '@/utils/profile';
  import { getLangNameFromCode } from '@/utils/form';
  import type { ProfilePayload } from '@/types/profile.type';
  import { PROFILE_UPDATE } from '@/queries/profile.query';
  import { routeConfigs } from '@/configs/routes';
  import { hasRouteAccess } from '@/utils/access';
  import { getUrlWithParams } from '@/utils/commun';

  const dispatch = createEventDispatcher();

  const profileUpdate = mutation<{ profileUpdate: ProfilePayload }>(PROFILE_UPDATE);

  let profileMenuOpen = false;
  let langMenuOpen = false;

  const toggleProfileMenu = (open: boolean) => {
    langMenuOpen = false;
    profileMenuOpen = open;
  };

  const toggleLangMenu = (open: boolean) => {
    profileMenuOpen = false;
    langMenuOpen = open;
  };

  const handleWindowClick = () => {
    toggleProfileMenu(false);
    toggleLangMenu(false);
  };

  const goTo = (pathParam: string) => {
    let path = pathParam;
    if (path.includes('stories')) {
      if (!$loggedUser.isConnected) return;
      path = getUrlWithParams(path, {
        accountId: $loggedUser.user.accountId,
      });
    }
    dispatch('clicklink', { path });
    navigate(path);
  };
</script>

<svelte:window on:click={handleWindowClick} />

<div class="flex flex-row items-center gap-3 text-base">
  {#if $loggedUser?.isConnected}
    <div class="h-full w-[125px] cursor-pointer text-right md:w-[72px]">
      <Avatar
        clickEvents
        on:click={() => toggleProfileMenu(true)}
        on:langclick={() => toggleLangMenu(true)}
        avatarUrl={$loggedUser.user.profile.avatarUrl}
        lang={$loggedUser.user.profile.langs?.[0]}
        firstname={$loggedUser.user.profile.firstname}
        lastname={$loggedUser.user.profile.lastname}
      />
    </div>
    {#if profileMenuOpen}
      <div
        class="absolute top-[100%] left-2 right-2 z-10 mt-5 bg-yellow-400 text-lg font-bold text-black shadow-2xl md:right-0 md:left-auto md:w-[150px] md:rounded-md md:shadow-lg"
        in:slide|local={{ duration: 150 }}
      >
        {#each routeConfigs as { id, requireLogin, roles, path, title, linkPositions }, index (id || path)}
          {#if hasRouteAccess($loggedUser, requireLogin, roles) && linkPositions?.includes('profile')}
            <div
              class={`cursor-pointer px-5 py-2 hover:bg-brown-800 hover:text-yellow-500 ${
                index === 0 ? 'md:rounded-t-lg' : ''
              }`}
              on:click={() => goTo(path)}
            >
              {title}
            </div>
          {/if}
        {/each}
        <div
          class="cursor-pointer px-5 py-2 hover:bg-brown-800 hover:text-yellow-500 md:rounded-b-lg"
          on:click={() => dispatch('logout')}
        >
          Logout
        </div>
      </div>
    {:else if langMenuOpen && $loggedUser.user.profile?.langs?.length > 1}
      <div
        class="text-center absolute top-[100%] left-2 right-2 z-10 mt-5 bg-yellow-400 text-lg font-bold text-black shadow-2xl md:right-0 md:left-auto md:w-[150px] md:rounded-md md:shadow-lg"
        in:slide|local={{ duration: 150 }}
      >
        <Fa icon={faExchange} class="w-full mt-2 mb-1" />
        {#each $loggedUser.user.profile?.langs as lang, index}
          {#if index}
            <div
              class={`lang-option cursor-pointer px-5 py-2 hover:text-yellow-500 hover:font-bold ${
                index === $loggedUser.user.profile.langs.length - 1 ? 'rounded-b-lg' : ''
              }`}
              on:click={() =>
                handleLangSelected(
                  lang,
                  $loggedUser.user.profile,
                  profileUpdate,
                  updateLoggedUserLangs,
                  navigate
                )}
            >
              <span class="px-2 py-1 rounded-full bg-creme-50/60">{getLangNameFromCode(lang)}</span>
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  {:else if $loggedUser?.loading}
    <Fa icon={faSpinner} pulse />
  {:else}
    <Link class="hover:text-yellow-400 active:text-yellow-500" to="login" on:click={() => goTo('login')}
      >Login</Link
    >
    <Button on:click={() => goTo('signup')}>Signup</Button>
  {/if}
</div>

<style lang="scss">
  .lang-option:hover {
    span {
      @apply bg-brown-800;
    }
  }
</style>
