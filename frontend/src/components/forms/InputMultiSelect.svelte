<script lang="ts">
  import { getContext, createEventDispatcher } from 'svelte';
  import Fa from 'svelte-fa';
  import { faTimes } from '@fortawesome/free-solid-svg-icons';
  import { faTag } from '@fortawesome/free-solid-svg-icons';

  import InputSelectWrapper from './InputSelectWrapper.svelte';
  import type { FormContext } from '@/contexts/form.context';
  import { getNewOption, type FormOption } from '@/utils/form';

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
  export let formatInput = (input: string) => input;

  let tagHovered: string | null = null;
  let searchInput = '';
  let inputRef: HTMLInputElement;
  let displayOptions = [];

  const dispatch = createEventDispatcher();

  export const focus = () => {
    if (inputRef) inputRef?.focus();
  };

  const formContext = getContext<FormContext>(formContextKey);
  const { data } = formContext;

  $: values = $data[fieldId];
  $: maxCrossed = max <= values.length;
  $: message = maxCrossed ? messageMax : messageEmpty;

  $: displayOptions = (() => {
    const beforeOptions: FormOption[] =
      searchInput && !options.find((opt) => opt.text === searchInput)
        ? [getNewOption(searchInput, displayOptions, values)]
        : [];
    return [...beforeOptions, ...options] as FormOption[];
  })().filter((o) => !values.find(({ id }) => o.id === id));

  $: maxCrossed ? toggleOptions(true) : toggleOptions(false);

  const dispatchSelection = (option: FormOption) => {
    dispatch('selected', {
      option,
    });
  };

  const resetInputSearch = () => {
    searchInput = '';
    dispatch('inputsearch', {
      value: '',
    });
    setTimeout(() => inputRef?.focus(), 5);
  };

  const onChange = (opt: FormOption, handleChange: (e) => void) => {
    if (maxCrossed || values.find((v) => v.id === opt.id)) return;
    resetInputSearch();
    handleChange({ target: { value: [...values, opt] } });
    dispatchSelection(opt);
  };

  const handleDelete = (opt: FormOption, handleChange: (e) => void) => {
    resetInputSearch();
    const newValues = values.filter((v) => v.id !== opt.id);
    handleChange({ target: { value: newValues } });
  };

  const handleInputChange = (e, onInputChange: (e) => void) => {
    const {
      target: { value },
    } = e;
    if (maxCrossed) return;
    const formatedValue = formatInput(value);
    searchInput = formatedValue;
    displayOptions = [getNewOption(formatedValue, displayOptions, values), ...displayOptions.splice(1)];
    onInputChange({ target: { value: formatedValue } });
  };

  $: toggleOptions = (hide: boolean) => {
    displayOptions = displayOptions.map(({ id, text }) => ({
      id,
      text,
      hide,
    }));
  };
</script>

<InputSelectWrapper
  on:input
  on:inputsearch
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
    <input
      bind:this={inputRef}
      class={`flex-grow bg-[transparent] outline-none ${!opened ? 'cursor-pointer' : ''} ${
        maxCrossed ? 'invisible w-0' : ''
      }`}
      value={inputValue}
      {placeholder}
      on:keydown={(e) => {
        onInputKeyDown(e, handleChange);
      }}
      on:input={(e) => handleInputChange(e, onInputChange)}
      on:focus={() => {
        resetInputSearch();
        toggleMenu(true);
      }}
    />
  </div>
</InputSelectWrapper>
