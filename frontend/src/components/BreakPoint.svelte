<script lang="ts">
  import { getBreakPoints, updateBreakPoint } from '@/stores/breakpoint.store';

  import { onMount } from 'svelte';

  let wasMounted = false;
  let listeners: {
    mql: MediaQueryList;
    listener: (e: MediaQueryListEvent) => void;
  }[];

  onMount(() => {
    wasMounted = true;
    return () => {
      removeActiveListener();
    };
  });

  $: {
    if (wasMounted) {
      removeActiveListener();
      initBreakPoints();
    }
  }

  const initBreakPoints = () => {
    listeners = [];
    getBreakPoints().forEach(({ value, code }) => {
      const mql = window.matchMedia(`(min-width: ${value}px)`);
      mql.matches && updateBreakPoint(code, mql.matches);
      const listener = (e: MediaQueryListEvent) => {
        updateBreakPoint(code, e.matches);
      };
      mql.addEventListener('change', listener);
      listeners.push({ mql, listener });
    });
  };

  const removeActiveListener = () => {
    if (!listeners) return;
    listeners.forEach(({ mql, listener }) => {
      mql.removeEventListener('change', listener);
    });
    listeners = [];
  };
</script>
