<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let avatarUrl = '';
  export let lang = '';
  export let firstname = '';
  export let lastname = '';
  export let clickEvents = false;

  const dispatch = createEventDispatcher();

  const getDispatcher = (eventName: string) => (e: Event) => {
    if (!clickEvents) return;
    e.stopPropagation();
    dispatch(eventName);
  };

  $: getInitials = () => `${firstname.charAt(0).toUpperCase()}${lastname.charAt(0).toUpperCase()}`;

  $: langFontSize = lang ? `calc(28px / ${lang.length})` : '100%';
</script>

<div class="relative h-full w-full" on:click={getDispatcher('click')}>
  {#if avatarUrl}
    <div
      class="h-full w-full rounded-full bg-cover bg-center"
      style={`background-image: url(${avatarUrl})`}
      alt="avatar"
    />
  {:else}
    <div class="flex h-full items-center justify-center rounded-full bg-yellow-400/90 text-4xl text-black">
      {getInitials()}
    </div>
  {/if}
  {#if lang?.length}
    <div
      class={'absolute bottom-0 right-0 h-[22px] w-[22px] rounded-full bg-cold-700/80 p-[1px] text-center font-bold leading-[22px] text-white'}
      style={`font-size: ${langFontSize}`}
      on:click={getDispatcher('langclick')}
    >
      {lang.toUpperCase()}
    </div>
  {/if}
</div>
