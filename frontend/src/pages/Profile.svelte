<script lang="ts">
  import { query } from 'svelte-apollo';
  import Fa from 'svelte-fa';
  import { faPlus, faUserNinja } from '@fortawesome/free-solid-svg-icons';

  import { loggedUser, setupLoggedUser } from '@/stores/auth.store';
  import { USER_GET } from '@/queries/user.query';
  import type { User } from '@/types/user.type';

  export let params;

  let hoverPicture = false;

  setupLoggedUser(query<{ user: User }>(USER_GET));

  $: console.log('params :', params);
</script>

<section class="flex flex-col items-center pt-10">
  {#if $loggedUser.isConnected && $loggedUser.user.validated}
    <div class="container max-w-[770px] rounded-lg bg-yellow-400/30 p-5">
      <header class="flex justify-between">
        <div>
          <h1 class="text-2xl">{$loggedUser.user.firstname} {$loggedUser.user.lastname}</h1>
          <p>Homme - 24 ans</p>
        </div>
        <div
          class="flex h-[150px] w-[150px] items-center justify-center rounded-full bg-yellow-400/70 text-3xl text-cold-800"
          on:mouseenter={() => (hoverPicture = true)}
          on:mouseleave={() => (hoverPicture = false)}
        >
          {#if !hoverPicture}
            <Fa icon={faUserNinja} />
          {:else}
            <Fa icon={faPlus} />
          {/if}
        </div>
      </header>
      <p class="mt-5 text-lg">
        Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant
        impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un
        imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices
        de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique
        informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à
        la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son
        inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.
      </p>
    </div>
  {:else}
    <p>User not connected or not validated</p>
  {/if}
</section>
