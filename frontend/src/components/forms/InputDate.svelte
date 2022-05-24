<script lang="ts">
  import InputWrapper from './InputWrapper.svelte';
  import { formatDate } from '@/utils/date';

  export let label = null;
  export let info: string = null;
  export let placeholder = '...';
  export let fieldId: string;
  export let formContextKey = 'form';
  export let style: 'classic' | 'h1' = 'classic';

  let inputValue = '';

  export const focus = () => {
    if (inputRef) inputRef.focus();
  };

  let inputRef: HTMLInputElement;

  $: getClass = () => {
    const classes = 'w-full focus:outline-none';
    const ext = (() => {
      switch (style) {
        default:
        case 'classic':
          return 'rounded-md bg-warm-700/70 px-3 py-1 text-white focus:bg-warm-800/70 placeholder:text-warm-200/70';
        case 'h1':
          return 'px-4 pt-2 pb-2 py-1 text-xl bg-creme-50/90 focus:border-b-4 focus:border-b-cold-500 focus:pb-1 placeholder:text-warm-700/70 h-[44px]';
      }
    })();
    return classes.concat(` ${ext}`);
  };

  const onChange = (e: any, handleChange: (e: any) => void) => {
    inputValue = formatDate(e.target.value);
    handleChange(e);
  };

  $: displayValue = (value: string) => {
    if (inputRef?.type === 'text') {
      if (!inputValue) inputValue = formatDate(value);
      return inputValue;
    }
    return value;
  };
</script>

<InputWrapper on:input {fieldId} {label} {info} {formContextKey} let:handleChange let:value>
  <input
    bind:this={inputRef}
    id={fieldId}
    class={getClass()}
    type="text"
    {placeholder}
    value={displayValue(value)}
    on:focus={() => (inputRef.type = 'date')}
    on:blur={() => (inputRef.type = 'text')}
    on:input={(e) => onChange(e, handleChange)}
  />
</InputWrapper>
