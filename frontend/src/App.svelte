<script lang="ts">
  import { Router, Route, Link } from 'svelte-routing';
  import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
  import { setContext } from '@apollo/client/link/context';
  import { setClient } from 'svelte-apollo';
  import { query } from 'svelte-apollo';
  import type { GetPropsParams } from 'svelte-routing/types/Link';

  import { env } from '@/libs/env';
  import { USER_GET } from '@/queries/user.query';
  import { setupLoggedUser, loggedUser, token } from '@/stores/auth.store';
  import { newAlert } from '@/stores/alert.store';
  import { setLocation } from '@/stores/location.store';
  import { routeConfigs } from '@/configs/routes';
  import { hasRouteAccess } from '@/utils/access';

  import Header from '@/components/header/Header.svelte';
  import Alert from '@/components/Alert.svelte';
  import Backdrop from '@/components/Backdrop.svelte';
  import Unknown from '@/pages/Unknown.svelte';
  import BreakPoint from '@/components/BreakPoint.svelte';

  import type { User } from '@/types/user.type';

  const httpLink = createHttpLink({
    uri: `${String(env.VITE_SERVER_HOST)}/graphql`,
  });

  const cache = new InMemoryCache({
    typePolicies: {
      User: { keyFields: ['id'] },
      Profile: { keyFields: ['id'] },
    },
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: $token ? `Bearer ${$token}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });

  setClient(client);

  setupLoggedUser(query<{ user: User }>(USER_GET));

  newAlert.subscribe(() => {
    scrollTo(0, 0);
  });

  const getProps = ({ location, isCurrent }: GetPropsParams) => {
    if (isCurrent) setLocation(location);
    return {};
  };

  export let url = '';
</script>

<Router {url}>
  <BreakPoint />
  <Header />
  <div>
    {#each routeConfigs as { id, path, component, requireLogin, roles, bis } (id || path)}
      {#if hasRouteAccess($loggedUser, requireLogin, roles)}
        {#if !bis}<Link to={path} {getProps} />{/if}

        <Route exact {path} let:params>
          <Alert />
          <Backdrop />
          <svelte:component this={component} {params} />
        </Route>
      {/if}
    {/each}
    <Route path="*"><Unknown /></Route>
  </div>
</Router>
