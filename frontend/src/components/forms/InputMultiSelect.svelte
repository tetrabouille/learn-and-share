<script lang="ts">
  import { getContext } from 'svelte';
  import Fa from 'svelte-fa';
  import { faTimes } from '@fortawesome/free-solid-svg-icons';
  import { faTag } from '@fortawesome/free-solid-svg-icons';

  import InputSelectWrapper from './InputSelectWrapper.svelte';
  import type { FormContext } from '@/contexts/form.context';
  import { getNewOption, type FormOptions } from '@/utils/form';
  import { lastValueFrom } from 'rxjs';

  export let fieldId: string;
  export let label = null;
  export let info: string = null;
  export let messageEmpty = 'Write a new tag';
  export let messageMax = 'Max tags reached';
  export let options: { id: string; text: string }[] = [];
  export let placeholder = '...';
  export let formContextKey = 'form';
  export let style: 'classic' | 'h1' = 'classic';
  export let max = 8;

  let tagHovered: string | null = null;

  const formContext = getContext<FormContext>(formContextKey);
  const { data } = formContext;

  export const focus = () => {
    if (inputRef) inputRef?.focus();
  };

  $: values = $data[fieldId];
  $: maxReached = max - 1 <= values.length;
  $: maxCrossed = max <= values.length;
  $: message = maxCrossed ? messageMax : messageEmpty;

  let inputRef: HTMLInputElement;
  let displayOptions: FormOptions[] = [
    {
      id: '__',
      text: '',
    },
    ...options,
  ];

  const onChange = (opt: FormOptions, handleChange: (e) => void) => {
    if (maxCrossed || values.find((v) => v.id === opt.id)) return;
    if (maxReached) toggleOptions(true);
    else toggleOptions(false);

    displayOptions = displayOptions.filter((o) => o.id !== opt.id);
    handleChange({ target: { value: [...values, opt] } });
  };

  const handleDelete = (opt: FormOptions, handleChange: (e) => void) => {
    if (max === values.length) toggleOptions(false);
    displayOptions = [opt, ...displayOptions];
    const newValues = values.filter((v) => v.id !== opt.id);
    handleChange({ target: { value: newValues } });
  };

  const handleInputChange = (e, onInputChange: (e) => void) => {
    const {
      target: { value },
    } = e;
    if (maxCrossed) return;
    displayOptions = [getNewOption(value, displayOptions, values), ...displayOptions.splice(1)];
    onInputChange({ target: { value } });
  };

  const toggleOptions = (hide: boolean) => {
    displayOptions = displayOptions.map(({ id, text }) => ({
      id,
      text,
      hide,
    }));
  };
</script>

<InputSelectWrapper
  on:input
  {onChange}
  {inputRef}
  messageEmpty={message}
  options={displayOptions}
  {fieldId}
  {label}
  {info}
  {formContextKey}
  closeMenuAfterSelect={false}
  {style}
  let:inputValue
  let:opened
  let:handleChange
  let:onInputChange
  let:onInputKeyDown
  let:toggleMenu
>
  <div class="flex flex-grow flex-wrap items-center gap-1">
    {#each values as value (value.id)}
      <span
        class="flex flex-shrink-0 items-center rounded-xl bg-cold-500/80 px-2 pb-[2px] text-sm text-white hover:bg-cold-500/70"
        on:mouseenter={() => {
          tagHovered = value.id;
        }}
        on:mouseleave={() => {
          tagHovered = null;
        }}
        on:click={() => handleDelete(value, handleChange)}
      >
        {value.text}
        {#if tagHovered === value.id}
          <Fa icon={faTimes} class="ml-1 w-[13px] pt-[2px]" />
        {:else}
          <Fa icon={faTag} class="ml-1 pt-[2px] w-[13px]" />
        {/if}
      </span>
    {/each}
    {#if !maxCrossed}
      <input
        bind:this={inputRef}
        class={`flex-grow bg-[transparent] outline-none ${!opened ? 'cursor-pointer' : ''}`}
        value={inputValue}
        {placeholder}
        on:keydown={(e) => {
          onInputKeyDown(e, handleChange);
        }}
        on:input={(e) => handleInputChange(e, onInputChange)}
        on:focus={() => {
          inputValue = '';
          toggleMenu(true);
        }}
      />
    {/if}
  </div>
</InputSelectWrapper>
