<script lang="ts">
  import Fa from 'svelte-fa';
  import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';

  export let disabled = false;
  export let type = 'button';
  export let loading = false;
  export let buttonClass = '';

  $: getButtonClasses = () => {
    const classes = [
      'relative',
      'flex',
      'w-fit',
      'items-center',
      'self-center',
      'rounded-full',
      'px-4',
      'py-1',
      buttonClass,
    ];
    if (disabled) classes.push('bg-warm-400/60', 'text-warm-700/90');
    else if (!loading)
      classes.push('text-cold-700', 'bg-yellow-400/90', 'hover:bg-yellow-200/90', 'active:bg-yellow-300/90');
    return classes.join(' ');
  };
</script>

<button class={getButtonClasses()} class:disabled disabled={disabled || loading} {type} on:click>
  {#if loading}
    <div class="absolute right-0 left-0 flex justify-center">
      <Fa icon={faSpinner} pulse />
    </div>
  {/if}
  <div class:invisible={loading}>
    <slot />
  </div>
</button>
