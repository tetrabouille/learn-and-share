<script lang="ts">
  import { backdropStore } from '@/stores/backdrop.store';
</script>

{#if $backdropStore.open}
  <div
    class="absolute top-0 left-0 right-0 bottom-0 z-10 h-full backdrop-blur-sm"
    on:click={() => {
      backdropStore.set({ open: false });
    }}
  />
{/if}
