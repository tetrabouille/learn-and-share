<script lang="ts">
  import { supabase } from '@/libs/supabase';

  export let location: any;

  let email: string;
  let password: string;

  const handleSubmit = async () => {
    console.log(email, password);
    await supabase.auth.signIn({ email, password });
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <label>
    <span>Email</span>
    <input type="email" bind:value={email} autocomplete="off" />
  </label>
  <label>
    <span>Password</span>
    <input type="password" bind:value={password} autocomplete="off" />
  </label>
  <button type="submit">Signup</button>
</form>

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0.5rem 0;
  }

  label span {
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
  }

  button {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  }
</style>
