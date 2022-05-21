<script lang="ts">
  import { crossfade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import Fa from 'svelte-fa';
  import { Link, navigate } from 'svelte-routing';
  import type { GetPropsParams } from 'svelte-routing/types/Link';
  import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';

  import { logout, loggedUser } from '@/stores/auth.store';
  import logo from '@/assets/constellation-logo.svg';
  import { routeConfigs } from '@/configs/routes';
  import Button from '@/components/Button.svelte';
  import { hasRouteAccess } from '@/utils/access';

  let currentPath: string;
  const getProps = ({ location, isCurrent }: GetPropsParams) => {
    currentPath = location.pathname;
    const classes = ['font-semibold', 'p-4'];
    if (isCurrent) classes.push('text-yellow-500');
    else classes.push('text-warm-100', 'hover:text-yellow-400');
    return { class: classes.join(' ') };
  };

  const clickLogout = () => logout(currentPath, navigate);

  $: isSelected = (path: string) => currentPath === path;

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
</script>

<header class="flex w-full flex-row gap-10 bg-brown-800 px-4 py-2 text-base text-warm-100 md:text-lg">
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
      <div
        class="cursor-pointer text-right hover:text-yellow-400 hover:underline"
        on:click={() => navigate('/profile')}
      >
        {$loggedUser.user.profile?.firstname}
        {$loggedUser.user.profile?.lastname}
      </div>
      <div class="cursor-pointer hover:text-yellow-400 active:text-yellow-500" on:click={clickLogout}>
        Logout
      </div>
    {:else if $loggedUser?.loading}
      <Fa icon={faSpinner} pulse />
    {:else}
      <Link class="hover:text-yellow-400 active:text-yellow-500" to="login">Login</Link>
      <Button on:click={() => navigate('signup')}>Signup</Button>
    {/if}
  </div>
</header>
