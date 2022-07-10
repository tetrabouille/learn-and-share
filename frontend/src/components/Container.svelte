<script lang="ts">
  export let isInput = false;
  export let rounded: 'sm' | 'md' | 'lg' = 'md';
  export let extraClass = '';
</script>

<div
  class={`container max-w-[770px] bg-brown-50/70 px-5 py-3 md:rounded-${rounded} ${
    isInput ? 'bg-yellow-400/20 md:shadow-md' : 'bg-brown-50/70 md:shadow-sm'
  } ${extraClass}`}
>
  <slot />
</div>
