<script lang="ts">
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';

  import { alertStore, removeAlert } from '@/stores/alert.store';
  import type { Alert } from '@/stores/alert.store';

  const duration = 200;
  const y = 30;

  const getClasses = (alert: Alert): string => {
    let classes = 'z-50 mb-2 mr-2 rounded-md py-1 px-5 text-center text-sm cursor-pointer';
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
</script>

<div class="absolute bottom-0 -z-10 flex w-full flex-col items-end">
  {#each $alertStore as alert (alert.message)}
    <div
      class={getClasses(alert)}
      on:click={() => removeAlert(alert)}
      in:fly={{ duration, y }}
      out:fly={{ duration: duration + 300, y }}
      animate:flip={{ duration }}
    >
      {alert.message}
    </div>
  {/each}
</div>
