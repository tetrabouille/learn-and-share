<script lang="ts" context="module">
  export type Option = {
    id: string;
    text?: string;
    icon?: 'check' | 'pen' | 'close' | 'submit';
    style?: string;
    handleClick?: (id: string) => void;
  };
</script>

<script lang="ts">
  import Fa from 'svelte-fa';
  import { cubicOut } from 'svelte/easing';
  import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
  import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
  import { faArrowUpRightFromSquare, faClose, faPen } from '@fortawesome/free-solid-svg-icons';
  import { fly } from 'svelte/transition';

  export let options: Option[] = [];
  export let styleContainer = '';
  export let styleButtons = '';
  export let loading = false;

  const getIcon = (icon: Option['icon']) => {
    switch (icon) {
      case 'check':
        return faCheck;
      case 'pen':
        return faPen;
      case 'close':
        return faClose;
      case 'submit':
        return faArrowUpRightFromSquare;
    }
  };
</script>

<div
  class={`-mt-[26px] flex flex-row flex-wrap items-center justify-end gap-2 ${styleContainer}`}
  in:fly={{ duration: 100, easing: cubicOut, x: -10 }}
>
  {#if loading}
    <div class={`flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 ${styleButtons}`}>
      <Fa class="text-sm" icon={faSpinner} pulse />
    </div>
  {:else}
    {#each options as { id, text, icon, style, handleClick } (id)}
      <button
        class={`flex grow-0 h-full ${icon ? 'w-7 h-7' : 'px-3'} items-center justify-center rounded-full ${
          !handleClick ? 'cursor-default' : ''
        } ${styleButtons} ${style}`}
        on:click={() => handleClick && handleClick(id)}
      >
        {#if icon}
          <Fa class="text-sm" icon={getIcon(icon)} />
        {:else if text}
          <span class="text-md">{text}</span>
        {/if}
      </button>
    {/each}
  {/if}
</div>
