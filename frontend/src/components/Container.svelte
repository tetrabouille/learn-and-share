<script lang="ts">
  export let type: 'input' | 'card' | 'invisible' = 'invisible';
  export let rounded: 'sm' | 'md' | 'lg' = 'md';
  export let extraClass = '';
  export let widthAuto = false;
</script>

<div
  class={`${widthAuto ? '' : 'w-full'} max-w-[770px] px-5 py-3 md:rounded-${rounded} ${(() => {
    switch (type) {
      case 'input':
        return 'bg-yellow-400/20 md:shadow-md';
      case 'card':
        return 'bg-brown-50/70 md:shadow-sm';
      default:
      case 'invisible':
        return '';
    }
  })()} ${extraClass}`}
>
  <slot />
</div>
