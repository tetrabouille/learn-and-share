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
      'bg-orange-600/90',
      'px-4',
      'py-1',
      'text-slate-50',
      buttonClass,
    ];
    if (disabled) classes.push('bg-stone-500/50', 'text-stone-50');
    else if (!loading) classes.push('hover:bg-orange-400/90', 'active:bg-orange-500/90');
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
