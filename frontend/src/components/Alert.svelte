<script lang="ts">
  import { onMount } from 'svelte';
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';

  import { alertStore, removeAlert, removeAllAlerts } from '@/stores/alert.store';
  import type { Alert } from '@/stores/alert.store';

  const duration = 200;
  const x = 300;

  onMount(() => {
    removeAllAlerts();
  });

  const getClasses = (alert: Alert): string => {
    let classes = 'z-10 mx-1 rounded-sm py-1 px-5 text-center text-sm cursor-pointer shadow-md min-w-[200px]';
    switch (alert.type) {
      case 'success':
        classes = `${classes} bg-green-400/70 text-green-800/90`;
        break;
      case 'error':
        classes = `${classes} bg-red-500/80 text-red-900`;
        break;
      case 'info':
      default:
        classes = `${classes} bg-blue-300/70 text-blue-800/90`;
        break;
    }
    return classes;
  };

  $: getBg = () => {
    const alert = $alertStore[0];
    switch (alert?.type) {
      case 'success':
        return 'bg-green-400/30';
      case 'error':
        return 'bg-red-500/30';
      case 'info':
        return 'bg-blue-300/30';
      default:
        return '';
    }
  };
</script>

<div
  class={`absolute top-[112px] left-0 right-0 flex w-full items-center justify-center md:top-[87px] ${getBg()}`}
>
  {#each $alertStore as alert (alert.message)}
    <div
      class={getClasses(alert)}
      on:click={() => removeAlert(alert)}
      in:fly|local={{ duration, x: -x }}
      out:fly|local={{ duration: duration + 300, x }}
      animate:flip={{ duration }}
    >
      {alert.message}
    </div>
  {/each}
</div>
