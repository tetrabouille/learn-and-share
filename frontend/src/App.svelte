<script lang="ts">
  import { Router, Link, Route } from "svelte-routing";
  import Home from "@/pages/Home.svelte";
  import About from "@/pages/About.svelte";
  import Header from "@/components/Header.svelte";
  import Login from "./pages/Login.svelte";

  export let url = "";
</script>

<Header />

<Router {url}>
  <nav>
    <Link to="/">Home</Link>
    <Link to="about">About</Link>
    <Link to="login">Login</Link>
  </nav>
  <div>
    <Route path="about" component={About} />
    <Route path="login" component={Login} />
    <Route path="/"><Home /></Route>
  </div>
</Router>

<style lang="scss">
</style>
