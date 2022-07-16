<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';

  import { getError } from '@/utils/form';
  import { BreakPointEnum, breakPointStore } from '@/stores/breakpoint.store';
  import type { FormContext } from '@/contexts/form.context';

  export let label = null;
  export let info: string = null;
  export let fieldId: string;
  export let formContextKey = 'form';

  const formContext = getContext<FormContext>(formContextKey);
  if (!formContext) throw new Error('InputText must be used within a FormContext');

  const { data, errors, touched } = formContext;

  const dispatch = createEventDispatcher();

  let scrollOnFocus = false;
  let div: HTMLDivElement;

  $: value = $data[fieldId];
  $: error = $touched ? getError(fieldId, $errors) : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    $data[fieldId] = e.target.value;
    dispatch('input', { value: e.target.value });
  };

  const handleFocus = () => {
    if (scrollOnFocus && div) div.scrollIntoView(true);
  };

  $: {
    const breakpoint = $breakPointStore;
    if (breakpoint.code === BreakPointEnum.SM || breakpoint.code === BreakPointEnum.XS || !breakpoint.code)
      scrollOnFocus = true;
    else scrollOnFocus = false;
  }
</script>

<div class="flex w-full flex-col" bind:this={div}>
  {#if label}
    <label for={fieldId}>{label}</label>
  {/if}
  <div class="relative">
    <slot {value} {handleChange} {handleFocus} />
    {#if error != null}
      <div class="absolute top-0 left-0 right-0 bottom-0 -z-10 rounded-md bg-red-600/90" />
    {/if}
  </div>
  {#if error}
    <div class="text-xs text-red-700">{error}</div>
  {:else if info}
    <div class="text-xs text-warm-800">{info}</div>
  {:else}
    <div class="invisible text-xs">_X_</div>
  {/if}
</div>
