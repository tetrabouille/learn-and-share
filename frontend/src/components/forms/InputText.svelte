<script lang="ts">
  import InputWrapper from './InputWrapper.svelte';

  export let label = null;
  export let info: string = null;
  export let placeholder = '...';
  export let type: 'text' | 'email' | 'password' | 'textarea' = 'text';
  export let fieldId: string;
  export let formContextKey = 'form';
  export let style: 'classic' | 'h1' = 'classic';
  export let disabled = false;

  export const focus = () => {
    if (inputRef) inputRef.focus();
  };

  let inputRef: HTMLInputElement;
</script>

<InputWrapper on:input {fieldId} {label} {info} {formContextKey} let:handleChange let:handleFocus let:value>
  <input
    bind:this={inputRef}
    id={fieldId}
    class={`w-full focus:outline-none ${
      style === 'classic'
        ? 'rounded-md bg-warm-700/70 px-3 py-1 text-white placeholder:text-warm-200/70 focus:bg-warm-800/70'
        : ''
    } ${
      style === 'h1'
        ? 'bg-creme-50/90 placeholder:text-warm-700/70 focus:border-b-cold-500 ' +
          'disabled:bg-brown-400/30 disabled:placeholder:text-warm-700/90 ' +
          'px-4 py-1 pt-2 pb-2 text-xl shadow-sm focus:border-b-4 focus:pb-1 md:shadow-none'
        : ''
    }`}
    {type}
    {placeholder}
    {value}
    {disabled}
    on:input={handleChange}
    on:focus={handleFocus}
  />
</InputWrapper>
