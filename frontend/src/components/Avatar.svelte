<script lang="ts">
  export let avatarUrl = '';
  export let lang = '';
  export let firstname = '';
  export let lastname = '';

  $: getInitials = () => `${firstname.charAt(0).toUpperCase()}${lastname.charAt(0).toUpperCase()}`;

  $: langFontSize = lang ? `calc(28px / ${lang.length})` : '100%';
</script>

<div class="relative h-full w-full">
  {#if avatarUrl}
    <div
      class="h-full w-full rounded-full bg-cover bg-center"
      style={`background-image: url(${avatarUrl})`}
      alt="avatar"
    />
  {:else}
    <div class="text-4xl rounded-full bg-yellow-400/90 h-full flex justify-center items-center text-black">
      {getInitials()}
    </div>
  {/if}
  {#if lang?.length}
    <div
      class={'absolute bottom-0 right-0 h-[22px] w-[22px] rounded-full bg-cold-700/80 p-[1px] text-center font-bold leading-[22px] text-white'}
      style={`font-size: ${langFontSize}`}
    >
      {lang.toUpperCase()}
    </div>
  {/if}
</div>
