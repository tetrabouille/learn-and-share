<script lang="ts" context="module">
  export type Item = {
    id: string;
    text: string;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Fa from 'svelte-fa';
  import { faStar, faExchange } from '@fortawesome/free-solid-svg-icons';

  export let direction: 'col' | 'row' = 'row';
  export let items: Item[];

  const dispatch = createEventDispatcher();
</script>

<div class={`mt-1 flex flex-wrap items-center gap-1 ${direction === 'col' ? 'flex-col' : ''}`}>
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
      <Fa icon={faExchange} class={`m-1 ${direction === 'col' ? 'rotate-90' : ''}`} />
    {/if}
  {/each}
</div>

<style lang="scss">
  .select {
    @apply cursor-pointer hover:bg-yellow-500/50;
  }
</style>
