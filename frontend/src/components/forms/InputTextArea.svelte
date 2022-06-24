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

  $: getClass = () => {
    const classes = 'w-full focus:outline-none -mb-2';
    const ext = (() => {
      switch (style) {
        default:
        case 'classic':
          return 'rounded-md bg-warm-700/70 px-3 py-1 text-white focus:bg-warm-800/70 placeholder:text-warm-200/70';
        case 'h1':
          return 'px-4 pt-2 pb-2 py-1 text-xl bg-creme-50/90 focus:border-b-4 focus:border-b-cold-500 focus:pb-1 placeholder:text-warm-700/70';
      }
    })();
    return classes.concat(` ${ext}`);
  };
</script>

<InputWrapper on:input {fieldId} {label} {info} {formContextKey} let:handleChange let:value>
  <textarea
    bind:this={inputRef}
    id={fieldId}
    class={`-mb-2 w-full focus:outline-none ${
      style === 'classic'
        ? 'rounded-md bg-warm-700/70 px-3 py-1 text-white placeholder:text-warm-200/70 focus:bg-warm-800/70'
        : ''
    } ${
      style === 'h1'
        ? 'bg-creme-50/90 placeholder:text-warm-700/70 focus:border-b-cold-500 disabled:bg-cold-200/30 ' +
          'px-4 py-1 pt-2 pb-2 text-xl focus:border-b-4 focus:pb-1 disabled:placeholder:text-warm-700/90'
        : ''
    }`}
    {placeholder}
    {value}
    {rows}
    on:input={handleChange}
    {disabled}
  />
</InputWrapper>
