<script lang="ts">
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import * as yup from 'yup';
  import Fa from 'svelte-fa';
  import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle';
  import { navigate } from 'svelte-routing';

  import { supabase } from '@/libs/supabase';
  import { validateSchema } from '@/libs/form';
  import { addAlert } from '@/stores/alert.store';
  import { accountCreated } from '@/stores/auth.store';
  import InputText from '@/components/forms/InputText.svelte';
  import Button from '@/components/Button.svelte';

  type Error = {
    key: string;
    message: string;
  };

  enum FormState {
    FIRST_FORM,
    SECOND_FORM,
    COMPLETE,
  }

  let formState = $accountCreated ? FormState.COMPLETE : FormState.FIRST_FORM;
  let loading = false;
  let error: Error = null;

  let email: string;
  let password: string;
  let confirmPassword: string;
  let firstname: string;
  let lastname: string;

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
    switch (formState) {
      case FormState.FIRST_FORM:
        if (valid) formState = FormState.SECOND_FORM;
        break;
      case FormState.SECOND_FORM:
        if (!valid) return (formState = FormState.FIRST_FORM);
        valid = await validateSchema2();
        if (valid) {
          loading = true;
          await supabase.auth
            .signUp({ email, password })
            .then(({ error: apiError }) => {
              if (apiError) {
                if (apiError.status === 400)
                  error = {
                    key: 'email',
                    message: 'This email is already used',
                  };
                else addAlert(apiError.message, 'error');
                return;
              }
              accountCreated.set(true);
              formState = FormState.COMPLETE;
            })
            .catch((err) => {
              console.error(err);
              addAlert(err.message as string, 'error');
            });
          loading = false;
        }
        break;
      case FormState.COMPLETE:
      default:
        break;
    }
  };

  $: getError = (fieldId: string) => {
    if (error && error.key === fieldId) {
      return error.message;
    }
  };

  $: refreshErrors = () => {
    if (!error) return;
    switch (formState) {
      case FormState.FIRST_FORM:
        void validateSchema1().then((valid) => {
          if (valid) error = null;
        });
        break;
      case FormState.SECOND_FORM:
        void validateSchema2().then((valid) => {
          if (valid) error = null;
        });
        break;
      default:
        break;
    }
  };
</script>

{#if formState !== FormState.COMPLETE}
  <form class="container mx-auto mt-10 flex max-w-sm flex-col gap-1" on:submit|preventDefault={handleSubmit}>
    <InputText
      fieldId="email"
      placeholder="email"
      type="email"
      label="Enter your email"
      bind:value={email}
      on:input={refreshErrors}
      error={getError('email')}
      initialValue="toto.tata@gmail.com"
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
      initialValue="supergreen"
    />
    {#if formState === FormState.SECOND_FORM}
      <div transition:slide|local={{ duration: 350, easing: quintOut }}>
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
    <Button buttonClass="mt-2" disabled={!!error} type="submit" {loading}>
      {#if formState === FormState.FIRST_FORM}
        Continue
      {:else}
        Sign up
      {/if}
    </Button>
  </form>
{:else}
  <div class="container mx-auto mt-10 flex max-w-sm flex-col gap-5">
    <Fa class="text-green-500/90 text-7xl" icon={faCheckCircle} />
    <div>
      <p class="w-full text-center text-xl m-1">Your account has been created.</p>
      <p class="w-full text-center text-xl m-1">Please check your email to validate your account.</p>
    </div>
    <Button buttonClass="text-lg min-w-[150px] justify-center" on:click={() => navigate('login')}>
      Login
    </Button>
  </div>
{/if}
