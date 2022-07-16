<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
  import Fa from 'svelte-fa';

  import InputWrapper from './InputWrapper.svelte';
  import { KeyCode } from '@/utils/enums';
  import { isInViewport } from '@/utils/commun';
  import { clickOutside } from '@/actions/click_outside';

  import type { FormOption } from '@/utils/form';
  import { afterUpdate } from 'svelte';

  export let label = null;
  export let info: string = null;
  export let messageEmpty = 'No matches';
  export let options: FormOption[] = [];
  export let fieldId: string;
  export let formContextKey = 'form';
  export let style: 'classic' | 'h1' = 'classic';
  export let closeMenuAfterSelect = true;
  export let inputRef: HTMLInputElement;
  export let onChange: (opt: FormOption, cb: (o: FormOption) => void) => void;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  let opened = false;
  let inputValue = '';
  let selectedValue = '';
  let selectedIndex = -1;
  let containerRef: HTMLDivElement;
  let optionsOntop = false;
  let isMenuReady = true;

  const toggleMenu = (b?: boolean) => {
    if (disabled) return;
    opened = b == null ? opened : b;

    inputValue = '';
    selectedValue = '';

    if (opened) {
      inputRef?.focus();
      isMenuReady = false;
      setTimeout(() => {
        isMenuReady = true;
      }, 1000);
    } else {
      selectedIndex = -1;
      inputRef?.blur();
    }
  };

  const onInputChange = (e) => {
    selectedIndex = -1;
    const value = e.target.value;
    if (selectedValue && value.includes(selectedValue)) inputValue = value.replace(selectedValue, '');
    else inputValue = value;
    selectedValue = '';
    dispatch('inputsearch', { value: inputValue });
  };

  const onInputKeyDown = (e, handleChange: (e) => void) => {
    if (e.keyCode === KeyCode.Tab) {
      toggleMenu(false);
    }
    if (e.keyCode === KeyCode.Enter) {
      let i = selectedIndex !== -1 ? selectedIndex : 0;
      if (selectedIndex === filteredOptions.length - 1) {
        selectedIndex--;
        if (filteredOptions[selectedIndex]) selectedValue = filteredOptions[selectedIndex].text;
        else selectedValue = '';
      }
      if (!filteredOptions[i]?.text) return;
      useValue(filteredOptions[i], handleChange);
    }

    if (filteredOptions.length === 0) return;

    if (e.keyCode === KeyCode.Up) {
      if (selectedIndex === 0 || selectedIndex === -1) selectedIndex = filteredOptions.length - 1;
      else selectedIndex--;
      selectedValue = filteredOptions[selectedIndex].text;
    }
    if (e.keyCode === KeyCode.Down) {
      if (selectedIndex >= filteredOptions.length - 1 || selectedIndex === -1) selectedIndex = 0;
      else selectedIndex++;
      selectedValue = filteredOptions[selectedIndex].text;
    }
  };

  const useValue = (opt: FormOption, handleChange: (e) => void) => {
    onChange(opt, handleChange);
    inputValue = '';
    selectedValue = '';
    if (closeMenuAfterSelect) toggleMenu(false);
  };

  $: filteredOptions = options.filter(
    (option) => option.text && !option.hide && option.text.includes(inputValue)
  );

  $: getClass = () => {
    let classes = `w-full focus:outline-none ${!disabled ? 'cursor-pointer' : ''}`;
    const ext = (() => {
      switch (style) {
        default:
        case 'classic':
          return 'rounded-md bg-warm-700/70 px-3 py-1 text-white focus:bg-warm-800/70';
        case 'h1':
          return (
            'px-4 pt-2 pb-2 py-1 text-xl focus:border-b-4 focus:border-b-cold-500 focus:pb-1 ' +
            'shadow-sm md:shadow-none ' +
            `${disabled ? 'bg-warm-400/60' : 'bg-creme-50/90'}`
          );
      }
    })();
    return classes.concat(` ${ext}`);
  };

  $: displayValue = () => {
    if (opened) return selectedValue || inputValue;
    return '';
  };

  afterUpdate(() => {
    const maxHeight = 230;
    let bottom = containerRef ? containerRef.offsetHeight * filteredOptions.length : 0;
    if (bottom > maxHeight) bottom = maxHeight;
    optionsOntop = !isInViewport(containerRef, { bottom });
  });
</script>

<svelte:window on:scroll={() => isMenuReady && toggleMenu(false)} />

<InputWrapper on:input {fieldId} {label} {info} {formContextKey} let:handleChange let:handleFocus let:value>
  <div
    bind:this={containerRef}
    class={`${getClass()} relative flex items-center`}
    on:click={() => {
      toggleMenu(true);
    }}
    use:clickOutside
    on:outclick={() => {
      toggleMenu(false);
    }}
  >
    <slot
      {value}
      inputValue={displayValue()}
      {opened}
      {handleChange}
      {handleFocus}
      {onInputKeyDown}
      {onInputChange}
      {toggleMenu}
    />
    <Fa icon={faAngleDown} class={`text-[1rem] text-cold-500/70 ${opened ? 'rotate-180' : ''}`} />
  </div>
  {#if opened}
    <ul
      class={`absolute left-0 right-0 z-50 flex max-h-[230px] overflow-y-auto border-[1px] border-cold-600/20 bg-creme-100 ${
        optionsOntop ? 'ontop flex-direction flex-col-reverse shadow-sm' : 'flex-col shadow-xl'
      }`}
      in:slide={{ duration: 200 }}
    >
      {#if filteredOptions.length}
        {#each filteredOptions as option, index (option.id)}
          <li
            class={`${getClass()} shadow-inner-sm ${selectedIndex === index ? 'bg-warm-500 text-white' : ''}`}
            on:mousedown={() => useValue(option, handleChange)}
            on:mouseenter={() => {
              selectedIndex = index;
            }}
          >
            {option.text}
          </li>
        {/each}
      {:else}
        <li class={`${getClass()} cursor-default text-sm text-warm-700/70`}>{messageEmpty}</li>
      {/if}
    </ul>
  {/if}
</InputWrapper>

<style lang="scss">
  .ontop {
    bottom: 100%;
  }
</style>
