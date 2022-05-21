<script lang="ts">
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import * as yup from 'yup';
  import Fa from 'svelte-fa';
  import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle';
  import { navigate } from 'svelte-routing';
  import { mutation } from 'svelte-apollo';

  import { USER_ADD } from '@/queries/user.query';
  import { setFormContext } from '@/contexts/form.context';
  import { supabase } from '@/libs/supabase';
  import { addError, validateSchema } from '@/utils/form';
  import { addAlert } from '@/stores/alert.store';
  import { accountCreated } from '@/stores/auth.store';
  import InputText from '@/components/forms/InputText.svelte';
  import Button from '@/components/Button.svelte';

  import { Error } from '@/types/error.type';
  import type { UserPayload } from '@/types/user.type';

  const userAdd = mutation<{ userAdd: UserPayload }>(USER_ADD);

  enum FormState {
    FIRST_FORM,
    SECOND_FORM,
    COMPLETE,
  }

  let formState = $accountCreated ? FormState.COMPLETE : FormState.FIRST_FORM;
  let loading = false;

  const inputRefs: {
    email?: InputText;
    password?: InputText;
    firstname?: InputText;
    lastname?: InputText;
    confirmPassword?: InputText;
  } = {};

  const { data, errors, touched } = setFormContext({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    confirmPassword: '',
  });

  const validationSchema1 = yup.object().shape({
    email: yup.string().email('Please enter a valid email address').required('Please enter an email address'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .required('Please enter a password'),
  });

  const validationSchema2 = yup.object().shape({
    firstname: yup.string().required('Please enter your first name'),
    lastname: yup.string().required('Please enter your last name'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const validateSchema1 = () => validateSchema(validationSchema1, $data, ['email', 'password'], errors);

  const validateSchema2 = () =>
    validateSchema(validationSchema2, $data, ['firstname', 'lastname', 'confirmPassword'], errors);

  const handleSubmit = async () => {
    $touched = true;
    let valid = await validateSchema1();
    switch (formState) {
      case FormState.FIRST_FORM:
        if (valid) {
          formState = FormState.SECOND_FORM;
          $touched = false;
        }
        break;
      case FormState.SECOND_FORM:
        valid = await validateSchema2();
        if (!valid) break;
        loading = true;
        try {
          await (async () => {
            const { error, user } = await supabase.auth.signUp({
              email: $data.email,
              password: $data.password,
            });

            if (error) {
              if (error.status === 400 || error.status === 429)
                return addError('email', 'This email is already used', errors);
              return addAlert(error.message, 'error');
            }

            if (user) {
              const response = await userAdd({
                variables: {
                  accountId: user.id,
                  email: $data.email,
                  firstname: $data.firstname,
                  lastname: $data.lastname,
                },
              });

              const userErrors = response.data?.userAdd?.userErrors;
              if (userErrors?.length) {
                if (userErrors.find((error) => error.code === Error.USER_ALREADY_EXISTS)) {
                  return addError('email', 'This email is already used', errors);
                }
                return addAlert(response.data.userAdd.userErrors[0].message, 'error');
              }

              accountCreated.set(true);
              formState = FormState.COMPLETE;
            }
          })();
        } catch (err) {
          console.error(err);
          addAlert(err.message as string, 'error');
        }
        loading = false;
        break;
      case FormState.COMPLETE:
      default:
        break;
    }
    if ($errors[0]?.key) inputRefs[$errors[0].key]?.focus();
  };

  $: refreshErrors = (feildId: string) => () => {
    const schema = (() => {
      if (feildId === 'email' || feildId === 'password') return validationSchema1;
      else return validationSchema2;
    })();
    return validateSchema(schema, $data, [feildId], errors);
  };
</script>

<section>
  {#if formState !== FormState.COMPLETE}
    <h1 class="py-10 text-center text-2xl">Create your account and start writing stories</h1>
    <form class="container mx-auto flex max-w-sm flex-col gap-1" on:submit|preventDefault={handleSubmit}>
      <InputText
        bind:this={inputRefs.email}
        fieldId="email"
        placeholder="email"
        type="email"
        label="Enter your email"
        on:input={refreshErrors('email')}
      />
      <InputText
        bind:this={inputRefs.password}
        fieldId="password"
        placeholder="password"
        type="password"
        label="Enter a password"
        info="Password must be at least 8 characters long"
        on:input={refreshErrors('password')}
      />
      {#if formState === FormState.SECOND_FORM}
        <div transition:slide|local={{ duration: 350, easing: quintOut }}>
          <div class="flex flex-row gap-2 pt-2">
            <InputText
              bind:this={inputRefs.firstname}
              fieldId="firstname"
              placeholder="firstname"
              type="text"
              label="Enter your first name"
              on:input={refreshErrors('firstname')}
            />
            <InputText
              bind:this={inputRefs.lastname}
              fieldId="lastname"
              placeholder="lastname"
              type="text"
              label="Enter your last name"
              on:input={refreshErrors('lastname')}
            />
          </div>
          <InputText
            bind:this={inputRefs.confirmPassword}
            fieldId="confirmPassword"
            placeholder="confirm password"
            type="password"
            label="Confirm your password"
            on:input={refreshErrors('confirmPassword')}
          />
        </div>
      {/if}
      <Button buttonClass="mt-2" disabled={$errors.length && $touched} type="submit" {loading}>
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
</section>
