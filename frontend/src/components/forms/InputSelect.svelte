<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import InputSelectWrapper from './InputSelectWrapper.svelte';

  export let label = null;
  export let info: string = null;
  export let messageEmpty = 'No matches';
  export let options: { id: string; text: string }[] = [];
  export let placeholder = '...';
  export let fieldId: string;
  export let formContextKey = 'form';
  export let style: 'classic' | 'h1' = 'classic';
  export let disabled = false;
  export let formatInput = (input: string) => input;

  export const focus = () => {
    if (inputRef) inputRef.focus();
  };

  const dispatch = createEventDispatcher();

  let inputRef: HTMLInputElement;

  const getValue = (key) => options.find(({ id }) => key === id)?.text || '';

  const onChange = (opt, handleChange) => {
    handleChange({ target: { value: opt.id } });
    dispatch('inputsearch', { value: '' });
  };
</script>

<InputSelectWrapper
  on:input
  on:inputsearch
  {onChange}
  {inputRef}
  {options}
  {messageEmpty}
  {fieldId}
  {label}
  {info}
  {formContextKey}
  {style}
  {disabled}
  let:value
  let:inputValue
  let:opened
  let:handleChange
  let:handleFocus
  let:onInputChange
  let:onInputKeyDown
  let:toggleMenu
>
  <input
    bind:this={inputRef}
    class={`flex-grow bg-[transparent] outline-none placeholder:text-warm-700/70 disabled:placeholder:text-warm-700/90 ${
      !opened && !disabled ? 'cursor-pointer' : ''
    }`}
    value={opened ? formatInput(inputValue) : getValue(value)}
    {placeholder}
    on:keydown={(e) => {
      onInputKeyDown(e, handleChange);
    }}
    on:input={onInputChange}
    on:focus={() => {
      handleFocus();
      dispatch('inputsearch', { value: '' });
      toggleMenu(true);
    }}
    {disabled}
  />
</InputSelectWrapper>
