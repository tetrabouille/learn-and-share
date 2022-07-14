<script lang="ts">
  import InputWrapper from './InputWrapper.svelte';

  export let label = null;
  export let info: string = null;
  export let placeholder = '...';
  export let fieldId: string;
  export let formContextKey = 'form';
  export let style: 'classic' | 'h1' = 'classic';
  export let rows = 8;
  export let disabled = false;

  export const focus = () => {
    if (inputRef) inputRef.focus();
  };

  let inputRef: HTMLTextAreaElement;
</script>

<InputWrapper on:input {fieldId} {label} {info} {formContextKey} let:handleChange let:handleFocus let:value>
  <textarea
    bind:this={inputRef}
    id={fieldId}
    class={`-mb-2 w-full focus:outline-none ${
      style === 'classic'
        ? 'rounded-md bg-warm-700/70 px-3 py-1 text-white placeholder:text-warm-200/70 focus:bg-warm-800/70'
        : ''
    } ${
      style === 'h1'
        ? 'bg-creme-50/90 placeholder:text-warm-700/70 focus:border-b-cold-500 disabled:bg-warm-400/60 ' +
          'px-4 py-1 pt-2 pb-2 text-xl focus:border-b-4 focus:pb-1 disabled:placeholder:text-warm-700/90 ' +
          'shadow-sm md:shadow-none'
        : ''
    }`}
    {placeholder}
    {value}
    {rows}
    on:input={handleChange}
    on:focus={handleFocus}
    {disabled}
  />
</InputWrapper>
