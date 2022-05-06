<script lang="ts">
  import * as yup from 'yup';
  import { slide, fade } from 'svelte/transition';
  import { navigate } from 'svelte-routing';
  import Fa from 'svelte-fa';
  import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
  import { mutation } from 'svelte-apollo';
  import { query } from 'svelte-apollo';

  import { USER_VALIDATE, GET_LOGGED_USER } from '@/graphql/user.query';
  import { setFormContext } from '@/contexts/form.context';
  import { validateSchema, addError } from '@/utils/form';
  import { supabase } from '@/libs/supabase';
  import { addAlert } from '@/stores/alert.store';
  import { loadingUser, login } from '@/stores/auth.store';
  import InputText from '@/components/forms/InputText.svelte';
  import Button from '@/components/Button.svelte';

  import type { User } from '@/types/user.type';

  const validateUser = mutation(USER_VALIDATE);

  let loading = false;
  let message = '';
  let emailSent = false;

  const inputRefs: {
    email?: InputText;
    password?: InputText;
  } = {};

  const { data, errors, touched } = setFormContext({
    email: '',
    password: '',
  });

  const validationSchema = yup.object().shape({
    email: yup.string().email('Please enter a valid email address').required('Please enter an email address'),
    password: yup.string().required('Please enter a password'),
  });

  const userQuery = query<{ user: User }>(GET_LOGGED_USER);

  const handleSubmit = async () => {
    $touched = true;
    const valid = await validateSchema(validationSchema, $data, ['email', 'password'], errors);
    if (valid) {
      loading = true;
      const { error } = await supabase.auth.signIn({ email: $data.email, password: $data.password });
      try {
        await (async () => {
          if (error) {
            if (error.status === 400) {
              if (error.message === 'Email not confirmed') {
                message =
                  'Your account is not yet validated. Please check your email for a confirmation link.';
                return;
              }
              addError('email', '', errors);
              addError('password', 'Email or password incorrect', errors);
              return;
            }
            addAlert(error.message, 'error');
            return;
          }
          await login(userQuery);
          await validateUser(null);
          navigate('/');
        })();
      } catch (err) {
        console.error(err);
        addAlert(err.message as string, 'error');
      }
      loading = false;
    }
    if ($errors[0]?.key) inputRefs[$errors[0].key]?.focus();
  };

  const sendEmail = () => {
    emailSent = true;
    message = 'You should receive an email shortly. Please click on the link to confirm your account.';
    supabase.auth
      .signUp({ email: $data.email, password: $data.password })
      .then(({ error }) => {
        if (error) {
          addAlert(error.message, 'error');
          return;
        }
      })
      .catch((err) => {
        console.error(err);
        addAlert(err.message as string, 'error');
      });
  };

  $: loadingUser(loading);

  $: refreshErrors = () => {
    message = '';
    emailSent = false;
    return validateSchema(validationSchema, $data, ['email', 'password'], errors);
  };
</script>

<section>
  <h1 class="py-10 text-center text-2xl">Sign in to your account</h1>
  <form class="container mx-auto flex max-w-sm flex-col gap-1" on:submit|preventDefault={handleSubmit}>
    <InputText
      bind:this={inputRefs.email}
      on:input={refreshErrors}
      fieldId="email"
      placeholder="email"
      type="email"
      label="Enter your email"
    />
    <InputText
      bind:this={inputRefs.password}
      on:input={refreshErrors}
      fieldId="password"
      placeholder="password"
      type="password"
      label="Enter a password"
    />
    {#if message}
      <div transition:slide|local={{ duration: 250 }}>
        <div class="rounded-md border-4 border-red-700/70 py-2 px-3">
          <p class="m-0 text-base">
            {message}
          </p>
          <div class="relative mt-1 text-center text-sm">
            <span class="invisible">_X_</span>
            {#if !emailSent}
              <span
                out:fade|local={{ duration: 200 }}
                class="absolute left-0 right-0 cursor-pointer text-blue-600/80"
                on:click={sendEmail}
              >
                Send again
              </span>
            {:else}
              <div class="absolute left-0 right-0 top-0" in:fade|local={{ duration: 200 }}>
                <button
                  class="bg-green-500/30 border-2 border-green-500 rounded-md px-5 py-[0.10rem]"
                  type="button"
                  on:click={() => {
                    message = '';
                    emailSent = false;
                  }}
                >
                  <Fa icon={faCheck} class="text-green-600/80 text-[1rem] mx-auto" />
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
    <Button buttonClass="mt-2" disabled={($errors.length && $touched) || !!message} type="submit" {loading}>
      Sign in
    </Button>
  </form>
</section>
