<script lang="ts">
  import { Link, navigate } from 'svelte-routing';
  import type { GetPropsParams } from 'svelte-routing/types/Link';
  import Fa from 'svelte-fa';
  import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';

  import { logout } from '@/stores/auth.store';
  import logo from '@/assets/constellation-logo.svg';
  import ProfileMenu from './ProfileMenu.svelte';
  import HeaderLinks from './HeaderLinks.svelte';
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { backdropStore } from '@/stores/backdrop.store';

  let isMenuReady = false;
  let currentPath: string;
  let isMenuOpen: boolean;
  let y: number;

  $: isMenuReady = y === 0 && isMenuOpen;

  const getProps = ({ location, isCurrent }: GetPropsParams) => {
    currentPath = location.pathname;
    const classes = ['font-semibold', 'p-4'];
    if (isCurrent) classes.push('text-yellow-500');
    else classes.push('text-warm-100', 'hover:text-yellow-400');
    return { class: classes.join(' ') };
  };

  const clickLogout = () => {
    toggleMenu();
    logout(currentPath, navigate);
  };

  const toggleMenu = (open?: boolean) => {
    isMenuOpen = open == null ? !isMenuOpen : open;
    if (!isMenuReady) scrollTo(0, 0);
    backdropStore.set({ open: isMenuOpen });
  };

  $: {
    if (!$backdropStore.open) isMenuOpen = false;
  }

  $: isSelected = (path: string) => currentPath === path;

  const getSlideMenu =
    (direction: 'in' | 'out') =>
    (node, { duration }) => {
      const easeFn = direction === 'in' ? cubicOut : cubicIn;
      return {
        duration,
        css: (t) => {
          const eased = easeFn(t);
          return `transform: translate(${eased * 18 - 18}rem);`;
        },
      };
    };
  const slideMenuIn = getSlideMenu('in');
  const slideMenuOut = getSlideMenu('out');
</script>

<svelte:window on:scroll={() => isMenuReady && toggleMenu(false)} bind:scrollY={y} />

<header class={`relative top-0 z-50 bg-brown-800 text-base text-warm-100 md:sticky md:text-lg`}>
  <div class="relative mx-auto flex w-full max-w-[1285px] flex-row justify-center gap-10 px-4 py-2">
    <div
      class={`absolute top-0 bottom-0 left-0 flex items-center p-2 md:hidden ${
        isMenuOpen ? 'bg-brown-700' : ''
      }`}
      on:mousedown={() => toggleMenu()}
    >
      {#if !isMenuOpen}
        <Fa icon={faBars} />
      {:else}
        <Fa icon={faClose} />
      {/if}
    </div>

    <div class="flex flex-col items-center gap-x-4 md:flex-row" on:click={() => toggleMenu(false)}>
      <Link to="/" class="shrink-0">
        <img class="h-[4.5rem] w-[4.5rem]" src={logo} alt="The Constellation Logo" />
      </Link>
      <h1 class="block font-light md:hidden xl:block">The Constellation's Assets</h1>
    </div>

    <nav class="text mr-auto hidden max-w-3xl flex-row items-center md:flex">
      <HeaderLinks
        on:click={(path) => {
          currentPath = path.detail.path;
        }}
        {getProps}
        {isSelected}
      />
    </nav>

    <div class="hidden md:flex">
      <ProfileMenu on:logout={clickLogout} />
    </div>
  </div>

  {#if isMenuOpen}
    <div
      class="menu absolute top-[100%] w-72 bg-brown-700 md:hidden"
      in:slideMenuIn|local={{ duration: 220 }}
      out:slideMenuOut|local={{ duration: 120 }}
    >
      <div class="relative my-3 flex h-[125px] pl-5">
        <ProfileMenu on:logout={clickLogout} on:clicklink={() => toggleMenu()} />
      </div>
      <HeaderLinks
        on:click={(path) => {
          toggleMenu();
          currentPath = path.detail.path;
        }}
        {getProps}
        {isSelected}
      />
    </div>
  {/if}
</header>

<style lang="scss">
  .menu {
    height: calc(100vh - 110px);
  }
</style>
