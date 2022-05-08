import type { Writable } from 'svelte/store';
import type { ObjectSchema, ValidationError } from 'yup';
import { v4 as uuid } from 'uuid';

export type Error = {
  key: string;
  message: string;
};

export type FormOptions = {
  text: string;
  id: string;
  hide?: boolean;
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

const getNewOption = (value: string, optionsLeft: FormOptions[], values: FormOptions[]) => {
  let id = uuid();
  while (
    optionsLeft.find((opt) => {
      opt.id === id;
    }) ||
    values.find((opt) => {
      opt.id === id;
    })
  ) {
    id = uuid();
  }
  return { id, text: value };
};

const debounce = (fn: (args: any) => void, delay: number) => () => debounce(fn, delay);

export { validateSchema, getError, addError, debounce, getNewOption };
export type {};
