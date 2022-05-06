<script lang="ts">
  import { getContext } from 'svelte';
  import { slide } from 'svelte/transition';
  import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
  import Fa from 'svelte-fa';

  import InputWrapper from './InputWrapper.svelte';
  import type { FormContext } from '@/contexts/form.context';

  export let label = null;
  export let info: string = null;
  export let options: { id: string; text: string }[] = [];
  export let placeholder = '...';
  export let fieldId: string;
  export let formContextKey = 'form';
  export let style: 'classic' | 'h1' = 'classic';

  enum KeyCode {
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,
  }

  export const focus = () => {
    if (inputRef) inputRef.focus();
  };

  const formContext = getContext<FormContext>(formContextKey);
  const { data } = formContext;

  let inputRef: HTMLInputElement;
  let opened = false;
  let inputValue = '';
  let selectedIndex = -1;

  const getValue = (key) => options.find(({ id }) => key === id)?.text || '';

  const toggleMenu = (b?: boolean) => {
    opened = b == null ? !opened : b;
    inputValue = '';
    if (opened) inputRef.focus();
    else selectedIndex = -1;
  };

  const onInputChange = (e) => {
    selectedIndex = -1;
    inputValue = e.target.value;
  };

  const onInputKeyDown = (e, handleChange: (e) => void) => {
    if (filteredOptions.length === 0) return;
    if (e.key === 'Enter') {
      const i = selectedIndex !== -1 ? selectedIndex : 0;
      handleChange({ target: { value: filteredOptions[i].id } });
      inputRef.blur();
    }
    if (e.keyCode === KeyCode.Up) {
      if (selectedIndex === 0 || selectedIndex === -1) selectedIndex = filteredOptions.length - 1;
      else selectedIndex--;
      inputRef.value = filteredOptions[selectedIndex].text;
    }
    if (e.keyCode === KeyCode.Down) {
      if (selectedIndex === filteredOptions.length - 1 || selectedIndex === -1) selectedIndex = 0;
      else selectedIndex++;
      inputRef.value = filteredOptions[selectedIndex].text;
    }
    console.log(selectedIndex);
  };

  $: filteredOptions = options.filter((option) => option.text.includes(inputValue));

  $: getClass = () => {
    let classes = 'w-full focus:outline-none cursor-pointer';
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
  <div
    class={`${getClass()} relative flex items-center`}
    on:click={() => {
      toggleMenu(true);
    }}
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
      on:blur={() => {
        toggleMenu(false);
      }}
      on:focus={() => {
        toggleMenu(true);
      }}
    />
    <Fa icon={faAngleDown} class={`text-[1rem] text-cold-500/70 ${opened ? 'rotate-180' : ''}`} />
  </div>
  {#if opened}
    <ul
      class="absolute left-0 right-0 z-50 border-[1px] border-cold-600/20 bg-creme-100 shadow-xl"
      in:slide={{ duration: 200 }}
      out:slide={{ duration: 200 }}
    >
      {#if filteredOptions.length}
        {#each filteredOptions as option, index (option.id)}
          <li
            class={`${getClass()} shadow-inner-sm ${selectedIndex === index ? 'bg-warm-500 text-white' : ''}`}
            on:mousedown={() => {
              inputValue = '';
              handleChange({ target: { value: option.id } });
              toggleMenu(false);
            }}
            on:mouseenter={() => {
              selectedIndex = index;
            }}
          >
            {option.text}
          </li>
        {/each}
      {:else}
        <li class={`${getClass()} text-sm text-warm-700/70 cursor-default`}>No topics matches</li>
      {/if}
    </ul>
  {/if}
</InputWrapper>
