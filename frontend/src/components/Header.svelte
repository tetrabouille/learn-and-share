<script lang="ts">
  import { crossfade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  import { Link } from 'svelte-routing';

  import logo from '@/assets/constellation-logo.svg';
  import type { GetPropsParams } from 'svelte-routing/types/Link';

  type Route = {
    path: string;
    name: string;
  };

  const routes: Route[] = [
    {
      path: '/',
      name: 'home',
    },
    {
      path: '/signup',
      name: 'signup',
    },
    {
      path: '/login',
      name: 'login',
    },
  ];

  let selectedRoute: Route;
  const getProps = ({ location, isCurrent }: GetPropsParams) => {
    selectedRoute = routes.find((route) => route.path === location.pathname);
    const classes = ['absolute p-4'];
    if (isCurrent) classes.push('text-orange-500', 'font-semibold');
    else classes.push('text-slate-50', 'hover:text-orange-400');
    return { class: classes.join(' ') };
  };

  $: isSelected = (route: Route) => selectedRoute?.path === route.path;

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

<header class="flex w-full flex-row gap-10 bg-header px-4 py-2 text-xl text-slate-50">
  <div class="flex flex-row items-center gap-4">
    <Link to="/">
      <img class="h-14" src={logo} alt="The Constellation Logo" />
    </Link>
    <h1 class="hidden font-light md:block">The Constellation's Assets</h1>
  </div>

  <nav class="text mr-auto flex max-w-3xl flex-row items-center">
    {#each routes as route (route.path)}
      <div class="relative flex flex-col">
        <Link
          to={route.path}
          on:click={() => {
            selectedRoute = route;
          }}
          {getProps}
        >
          {route.name}
        </Link>
        <div class="invisible p-4 font-semibold">
          {route.name}
        </div>
        {#if isSelected(route)}
          <div
            class="absolute bottom-0 w-full border-2 border-orange-500"
            in:receive={{ key: 'link' }}
            out:send={{ key: 'link' }}
          />
        {/if}
      </div>
    {/each}
  </nav>

  <div class="flex flex-row items-center gap-3">
    <Link class="hover:text-orange-400 active:text-orange-500" to="login">Login</Link>
    <Link class="rounded-full bg-orange-600 px-4 py-1 hover:bg-orange-400 active:bg-orange-500" to="signup"
      >Signup</Link
    >
  </div>
</header>
