<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';

  import { getError } from '@/utils/form';
  import type { FormContext } from '@/contexts/form.context';

  export let label = null;
  export let info: string = null;
  export let fieldId: string;
  export let formContextKey = 'form';

  const formContext = getContext<FormContext>(formContextKey);
  if (!formContext) throw new Error('InputText must be used within a FormContext');

  const { data, errors, touched } = formContext;

  const dispatch = createEventDispatcher();

  $: value = $data[fieldId];
  $: error = $touched ? getError(fieldId, $errors) : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    $data[fieldId] = e.target.value;
    dispatch('input', { value: e.target.value });
  };
</script>

<div class="flex flex-col">
  {#if label}
    <label for={fieldId}>{label}</label>
  {/if}
  <div class="relative">
    <slot {value} {handleChange} />
    {#if error != null}
      <div class="absolute top-0 left-0 right-0 bottom-0 -z-10 rounded-md bg-red-600/90" />
    {/if}
  </div>
  {#if error}
    <div class="text-xs text-red-700">{error}</div>
  {:else if info}
    <div class="text-xs text-warm-800">{info}</div>
  {:else}
    <div class="text-xs invisible">_X_</div>
  {/if}
</div>
