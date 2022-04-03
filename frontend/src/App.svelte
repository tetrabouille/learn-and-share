<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import Home from '@/pages/Home.svelte';
  import Signup from '@/pages/Signup.svelte';
  import Header from '@/components/Header.svelte';
  import Login from './pages/Login.svelte';
  import Alert from './components/Alert.svelte';

  export let url = '';
</script>

<Router {url}>
  <Header />
  <Alert />
  <div>
    <Route path="signup" component={Signup} />
    <Route path="login" component={Login} />
    <Route path="/"><Home /></Route>
  </div>
</Router>
