<script lang="ts">
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

  export const focus = () => {
    if (inputRef) inputRef.focus();
  };

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
  {disabled}
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
    class={`flex-grow bg-[transparent] outline-none placeholder:text-warm-700/70 disabled:placeholder:text-warm-700/90 ${
      !opened && !disabled ? 'cursor-pointer' : ''
    }`}
    value={opened ? inputValue : getValue(value)}
    {placeholder}
    on:keydown={(e) => {
      onInputKeyDown(e, handleChange);
    }}
    on:input={onInputChange}
    on:focus={() => {
      toggleMenu(true);
    }}
    {disabled}
  />
</InputSelectWrapper>
