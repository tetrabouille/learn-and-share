<script lang="ts">
  import { crossfade, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import Fa from 'svelte-fa';
  import { mutation } from 'svelte-apollo';
  import { Link, navigate } from 'svelte-routing';
  import type { GetPropsParams } from 'svelte-routing/types/Link';
  import { faSpinner, faExchange } from '@fortawesome/free-solid-svg-icons';

  import Button from '@/components/Button.svelte';
  import Avatar from '@/components/Avatar.svelte';
  import { logout, loggedUser } from '@/stores/auth.store';
  import logo from '@/assets/constellation-logo.svg';
  import { routeConfigs } from '@/configs/routes';
  import { hasRouteAccess } from '@/utils/access';
  import { handleLangSelected, updateLoggedUserLangs } from '@/utils/profile';
  import { getLangNameFromCode } from '@/utils/form';
  import type { ProfilePayload } from '@/types/profile.type';
  import { PROFILE_UPDATE } from '@/queries/profile.query';

  let profileMenuOpen = false;
  let langMenuOpen = false;
  let currentPath: string;

  const profileUpdate = mutation<{ profileUpdate: ProfilePayload }>(PROFILE_UPDATE);

  const getProps = ({ location, isCurrent }: GetPropsParams) => {
    currentPath = location.pathname;
    const classes = ['font-semibold', 'p-4'];
    if (isCurrent) classes.push('text-yellow-500');
    else classes.push('text-warm-100', 'hover:text-yellow-400');
    return { class: classes.join(' ') };
  };

  const clickLogout = () => logout(currentPath, navigate);

  $: isSelected = (path: string) => currentPath === path;

  window.addEventListener('click', () => {
    toggleProfileMenu(false);
    toggleLangMenu(false);
  });

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 500),
    fallback() {
      return {
        duration: 400,
        easing: quintOut,
        css: (t) => `
					transform: scale(${t});
					opacity: ${t}
				`,
      };
    },
  });

  const toggleProfileMenu = (open: boolean) => {
    langMenuOpen = false;
    profileMenuOpen = open;
  };

  const toggleLangMenu = (open: boolean) => {
    profileMenuOpen = false;
    langMenuOpen = open;
  };
</script>

<header class="bg-brown-800 text-base text-warm-100 md:text-lg">
  <div class="mx-auto flex w-full max-w-[1285px] flex-row gap-10 px-4 py-2">
    <div class="flex flex-row items-center gap-4">
      <Link to="/" class="shrink-0">
        <img class="h-[4.5rem] w-[4.5rem]" src={logo} alt="The Constellation Logo" />
      </Link>
      <h1 class="hidden font-light xl:block">The Constellation's Assets</h1>
    </div>

    <nav class="text mr-auto flex max-w-3xl flex-row items-center">
      {#each routeConfigs as { requireLogin, roles, path, title, linkPositions } (path)}
        {#if hasRouteAccess($loggedUser, requireLogin, roles) && linkPositions?.includes('header')}
          <div class="relative flex shrink-0 flex-col">
            <Link
              to={path}
              on:click={() => {
                currentPath = path;
              }}
              {getProps}
            >
              {title}
            </Link>
            {#if isSelected(path)}
              <div
                class="absolute bottom-0 w-full border-t-4 border-yellow-500"
                in:receive|local={{ key: 'link' }}
                out:send|local={{ key: 'link' }}
              />
            {/if}
          </div>
        {/if}
      {/each}
    </nav>

    <div class="flex flex-row items-center gap-3 text-base">
      {#if $loggedUser?.isConnected}
        <div class="relative h-full w-[72px] cursor-pointer text-right">
          <Avatar
            clickEvents
            on:click={() => toggleProfileMenu(true)}
            on:langclick={() => toggleLangMenu(true)}
            avatarUrl={$loggedUser.user.profile.avatarUrl}
            lang={$loggedUser.user.profile.langs?.[0]}
            firstname={$loggedUser.user.profile.firstname}
            lastname={$loggedUser.user.profile.lastname}
          />
          {#if profileMenuOpen}
            <div
              class="profilemenu absolute -right-4 z-10 w-[150px] rounded-b-lg bg-yellow-400 text-lg font-bold text-black shadow-lg"
              transition:slide|local={{ duration: 150 }}
            >
              <div
                class="cursor-pointer px-5 py-2 hover:bg-brown-800 hover:text-yellow-500"
                on:click={() => navigate('/profile')}
              >
                Profile
              </div>
              <div class="cursor-pointer px-5 py-2 hover:bg-brown-800 hover:text-yellow-500">Stories</div>
              <div class="cursor-pointer px-5 py-2 hover:bg-brown-800 hover:text-yellow-500">Favorites</div>
              <div
                class="cursor-pointer rounded-b-lg px-5 py-2 hover:bg-brown-800 hover:text-yellow-500"
                on:click={clickLogout}
              >
                Logout
              </div>
            </div>
          {:else if langMenuOpen && $loggedUser.user.profile?.langs?.length > 1}
            <div
              class="profilemenu absolute -right-4 z-10 w-[150px] rounded-b-lg bg-yellow-400 text-lg text-black shadow-lg text-center"
              transition:slide|local={{ duration: 150 }}
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
        </div>
      {:else if $loggedUser?.loading}
        <Fa icon={faSpinner} pulse />
      {:else}
        <Link class="hover:text-yellow-400 active:text-yellow-500" to="login">Login</Link>
        <Button on:click={() => navigate('signup')}>Signup</Button>
      {/if}
    </div>
  </div>
</header>

<style lang="scss">
  .profilemenu {
    top: calc(100% + 0.5rem);
  }
  .lang-option:hover {
    span {
      @apply bg-brown-800;
    }
  }
</style>
