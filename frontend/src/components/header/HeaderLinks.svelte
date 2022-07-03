<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { routeConfigs } from '@/configs/routes';
  import { hasRouteAccess } from '@/utils/access';
  import { Link } from 'svelte-routing';
  import { loggedUser } from '@/stores/auth.store';
  import { crossfade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  export let getProps: ({ location, isCurrent }) => any;
  export let isSelected: (x: string) => boolean;

  const dispatch = createEventDispatcher();

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 500),
    fallback() {
      return {
        duration: 400,
        easing: quintOut,
        css: (t) => `transform: scale(${t}); opacity: ${t}`,
      };
    },
  });
</script>

{#each routeConfigs as { id, requireLogin, roles, path, title, linkPositions } (id || path)}
  {#if hasRouteAccess($loggedUser, requireLogin, roles) && linkPositions?.includes('header')}
    <div class="relative flex shrink-0 flex-col">
      <Link
        to={path}
        on:click={() => {
          dispatch('click', { path });
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
