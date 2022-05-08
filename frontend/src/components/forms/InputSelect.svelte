<script lang="ts">
  import { getContext } from 'svelte';

  import InputSelectWrapper from './InputSelectWrapper.svelte';
  import type { FormContext } from '@/contexts/form.context';

  export let label = null;
  export let info: string = null;
  export let messageEmpty = 'No matches';
  export let options: { id: string; text: string }[] = [];
  export let placeholder = '...';
  export let fieldId: string;
  export let formContextKey = 'form';
  export let style: 'classic' | 'h1' = 'classic';

  export const focus = () => {
    if (inputRef) inputRef.focus();
  };

  const formContext = getContext<FormContext>(formContextKey);
  const { data } = formContext;

  let inputRef: HTMLInputElement;

  const getValue = (key) => options.find(({ id }) => key === id)?.text || '';

  const onChange = (opt, handleChange) => {
    handleChange({ target: { value: opt.id } });
  };
</script>

<InputSelectWrapper
  on:input
  {onChange}
  {inputRef}
  {options}
  {messageEmpty}
  {fieldId}
  {label}
  {info}
  {formContextKey}
  {style}
  let:value
  let:inputValue
  let:opened
  let:handleChange
  let:onInputChange
  let:onInputKeyDown
  let:toggleMenu
>
  <input
    bind:this={inputRef}
    class={`flex-grow bg-[transparent] outline-none ${!opened ? 'cursor-pointer' : ''}`}
    value={opened ? inputValue : getValue(value)}
    {placeholder}
    on:keydown={(e) => {
      onInputKeyDown(e, handleChange);
    }}
    on:input={onInputChange}
    on:focus={() => {
      toggleMenu(true);
    }}
  />
</InputSelectWrapper>
