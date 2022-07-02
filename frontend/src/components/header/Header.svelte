<script lang="ts">
  import { Link, navigate } from 'svelte-routing';
  import type { GetPropsParams } from 'svelte-routing/types/Link';
  import Fa from 'svelte-fa';
  import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';

  import { logout } from '@/stores/auth.store';
  import logo from '@/assets/constellation-logo.svg';
  import ProfileMenu from './ProfileMenu.svelte';
  import HeaderLinks from './HeaderLinks.svelte';

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
</script>

<header class="sticky top-0 z-50 bg-brown-800 text-base text-warm-100 md:text-lg">
  <div class="relative mx-auto flex w-full max-w-[1285px] flex-row justify-center gap-10 px-4 py-2">
    <div class="absolute top-0 bottom-0 left-0 flex items-center bg-brown-700 p-2 md:hidden">
      <!-- <Fa icon={faBars} /> -->
      <Fa icon={faClose} />
    </div>

    <div class="flex flex-col items-center gap-x-4 md:flex-row">
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

  <div class="menu absolute top-[100%] h-screen w-72 bg-brown-700 md:hidden">
    <div class="relative my-3 flex h-[125px] pl-5">
      <ProfileMenu on:logout={clickLogout} />
    </div>
    <HeaderLinks
      on:click={(path) => {
        currentPath = path.detail.path;
      }}
      {getProps}
      {isSelected}
    />
  </div>
</header>

<style lang="scss">
  .menu {
    top: calc;
  }
</style>
