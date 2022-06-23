<script lang="ts" context="module">
  export type Item = {
    id: string;
    text: string;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Fa from 'svelte-fa';
  import { faStar } from '@fortawesome/free-solid-svg-icons';

  export let items: Item[];

  const dispatch = createEventDispatcher();
</script>

{#each items as item, index (item.id)}
  <div
    class="flex items-center rounded-full bg-warm-500/30 px-2 text-lg"
    class:select={index !== 0}
    on:click={() => dispatch('select', { item, index })}
  >
    {item.text}
    {#if index === 0}
      <Fa icon={faStar} class="ml-1 text-xs text-yellow-600" />
    {/if}
  </div>
  {#if index === 0 && items.length > 1}
    <div class="my-1 border-l-2 border-cold-900/30" />
  {/if}
{/each}

<style lang="scss">
  .select {
    @apply cursor-pointer hover:bg-yellow-500/50;
  }
</style>
