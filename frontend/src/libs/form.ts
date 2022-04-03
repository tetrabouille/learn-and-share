import type { Writable } from 'svelte/store';
import type { ObjectSchema, ValidationError } from 'yup';

export type Error = {
  key: string;
  message: string;
};

const getError = (fieldId: string, errors: Error[]) => {
  if (!errors.length) return;
  const error = errors.find((error) => error.key === fieldId);
  if (error && error.key === fieldId) {
    return error.message;
  }
};

const addError = (key: string, message: string, errorsStore: Writable<Error[]>) => {
  errorsStore.update((errors) => {
    if (!errors.length) return [{ key, message }];
    const previousError = errors.find((error) => error.key === key);
    if (previousError) {
      previousError.message = message;
      return [...errors];
    }
    return [...errors, { key, message }];
  });
};

const removeError = (key: string, errorsStore: Writable<Error[]>) => {
  errorsStore.update((errors) => {
    return errors.filter((error) => error.key !== key);
  });
};

const validateSchema = async (
  schema: ObjectSchema<any>,
  values: any,
  keys: string[],
  errorsStore: Writable<Error[]>
): Promise<boolean> => {
  let valide = true;
  await Promise.all(
    keys.map((key) =>
      schema
        .validateAt(key, values)
        .then(() => removeError(key, errorsStore))
        .catch((err: ValidationError) => {
          if (err.name === 'ValidationError') {
            valide = false;
            return addError(key, err.errors[0], errorsStore);
          }
          console.error(err);
        })
    )
  );
  return valide;
};

export { validateSchema, getError, addError };
