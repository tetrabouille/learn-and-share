<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';

  import { getError } from '@/libs/form';
  import type { FormContext } from '@/contexts/form.context';

  export let label = null;
  export let info: string = null;
  export let placeholder = '...';
  export let type: 'text' | 'email' | 'password' = 'text';
  export let fieldId: string;
  export let formContextKey = 'form';

  export const focus = () => {
    if (inputRef) inputRef.focus();
  };

  const formContext = getContext<FormContext>(formContextKey);
  if (!formContext) throw new Error('InputText must be used within a FormContext');

  const { data, errors, touched } = formContext;

  let inputRef: HTMLInputElement;

  const dispatch = createEventDispatcher();

  $: value = $data[fieldId];
  $: error = $touched ? getError(fieldId, $errors) : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    $data[fieldId] = e.target.value;
    dispatch('input');
  };
</script>

<div class="flex flex-col">
  {#if label}
    <label for={fieldId}>{label}</label>
  {/if}
  <div class="relative">
    <input
      bind:this={inputRef}
      id={fieldId}
      class="w-full rounded-md bg-stone-700/40 px-3 py-1 text-white placeholder:text-stone-100/80 focus:bg-stone-700/50 focus:outline-none"
      {type}
      {placeholder}
      {value}
      on:input={handleChange}
      autocomplete="off"
    />
    {#if error != null}
      <div class="absolute top-0 left-0 right-0 bottom-0 -z-10 rounded-md bg-red-500/40" />
    {/if}
  </div>
  {#if error}
    <div class="text-xs text-red-600/90">{error}</div>
  {:else if info}
    <div class="text-xs text-slate-600">{info}</div>
  {:else}
    <div class="text-xs invisible">_X_</div>
  {/if}
</div>
