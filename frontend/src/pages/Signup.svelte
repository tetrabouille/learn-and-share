<script lang="ts">
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import * as yup from 'yup';

  import { supabase } from '@/libs/supabase';
  import { validateSchema } from '@/libs/form';
  import InputText from '@/components/forms/InputText.svelte';

  type Error = {
    key: string;
    message: string;
  };

  let firstFormValid = false;
  let error: Error = null;

  let email: string;
  let password: string;
  let firstname: string;
  let lastname: string;
  let confirmPassword: string;

  const validationSchema1 = yup.object().shape({
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .required('Please enter a password'),
    email: yup.string().email('Please enter a valid email address').required('Please enter an email address'),
  });

  const validationSchema2 = yup.object().shape({
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    lastname: yup.string().required('Please enter your last name'),
    firstname: yup.string().required('Please enter your first name'),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schemaIsValid = (schema: yup.ObjectSchema<any>, values: any) => {
    return validateSchema(schema, values, error).then((newError) => {
      error = newError;
      return !error;
    });
  };

  const validateSchema1 = () =>
    schemaIsValid(validationSchema1, {
      email,
      password,
    });

  const validateSchema2 = () =>
    schemaIsValid(validationSchema2, {
      firstname,
      lastname,
      password,
      confirmPassword,
    });

  const handleSubmit = async () => {
    let valid = await validateSchema1();
    if (!firstFormValid && valid) {
      firstFormValid = true;
      return;
    }
    firstFormValid = valid;

    if (firstFormValid) {
      valid = await validateSchema2();
      if (valid) {
        console.log('valide !');

        // supabase.auth
        //   .signUp({
        //     email,
        //     password,
        //   })
        //   .then((res) => {
        //     // TODO
        //     console.log(res);
        //   })
        //   .catch((err) => {
        //     // TODO
        //     console.log(err);
        //   });
      }
    }
  };

  $: getError = (fieldId: string) => {
    if (error && error.key === fieldId) {
      return error.message;
    }
  };

  $: refreshErrors = () => {
    if (!firstFormValid && error) {
      void validateSchema1().then((valid) => {
        if (valid) error = null;
      });
    } else if (firstFormValid && error) {
      void validateSchema2().then((valid) => {
        if (valid) error = null;
      });
    }
  };
</script>

<form class="container mx-auto mt-10 flex max-w-sm flex-col gap-1" on:submit|preventDefault={handleSubmit}>
  <InputText
    fieldId="email"
    placeholder="email"
    type="email"
    label="Enter your email"
    bind:value={email}
    on:input={refreshErrors}
    error={getError('email')}
    initialValue="t.t@g.com"
  />
  <InputText
    fieldId="password"
    placeholder="password"
    type="password"
    label="Enter a password"
    bind:value={password}
    on:input={refreshErrors}
    info="Password must be at least 8 characters long"
    error={getError('password')}
    initialValue="12345678"
  />
  {#if firstFormValid}
    <div transition:slide={{ duration: 350, easing: quintOut }}>
      <div class="flex flex-row gap-2 pt-2">
        <InputText
          fieldId="firstname"
          placeholder="firstname"
          type="text"
          label="Enter your first name"
          bind:value={firstname}
          on:input={refreshErrors}
          error={getError('firstname')}
        />
        <InputText
          fieldId="lastname"
          placeholder="lastname"
          type="text"
          label="Enter your last name"
          bind:value={lastname}
          on:input={refreshErrors}
          error={getError('lastname')}
        />
      </div>
      <InputText
        fieldId="confirmPassword"
        placeholder="confirm password"
        type="password"
        label="Confirm your password"
        bind:value={confirmPassword}
        on:input={refreshErrors}
        error={getError('confirmPassword')}
      />
    </div>
  {/if}
  <button
    class="mt-2 w-fit self-center rounded-full bg-orange-600/90 px-4 py-1 text-slate-50 hover:bg-orange-400/90 active:bg-orange-700/90"
    class:disabled={error}
    disabled={!!error}
    type="submit"
  >
    {#if firstFormValid}
      Sign up
    {:else}
      Continue
    {/if}
  </button>
</form>

<style lang="scss">
  .disabled {
    @apply bg-stone-500/50 text-stone-50;
  }
</style>
