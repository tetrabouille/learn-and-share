<script lang="ts">
  import { query } from 'svelte-apollo';
  import { USER_GET_ALL } from '@/queries/user.query';
  import type { User } from '@/types/user.type';
  import Button from '@/components/Button.svelte';
  import { checkUserRoles } from '@/utils/access';
  import { loggedUser } from '@/stores/auth.store';
  import { addAlert } from '@/stores/alert.store';
  import { getLangNameFromCode } from '@/utils/form';

  const users = query<{ users: User[] }>(USER_GET_ALL);
</script>

<div class="container mx-auto flex flex-wrap gap-5 p-10">
  {#if $users.data?.users?.length && checkUserRoles($loggedUser.user, ['user'])}
    {#each $users.data.users as { profile, validated, id } (id)}
      <div class="w-[300px] rounded-md bg-brown-50/70 p-5 text-warm-900/90 shadow-sm">
        <h3 class="text-lg">
          {profile.firstname}
          {profile.lastname}
        </h3>
        <p>Validated : {validated ? 'yes' : 'no'}</p>
        <p>
          Languages :
          {profile.langs.map(getLangNameFromCode).join(', ')}
        </p>
        <Button
          buttonClass="ml-auto mt-6 text-md"
          on:click={() => addAlert(`${profile.firstname} ${profile.lastname} clicked !`, 'success')}
          >Click me</Button
        >
      </div>
    {/each}
  {/if}
</div>
