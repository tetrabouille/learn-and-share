import type { Writable } from 'svelte/store';
import type { ObjectSchema, ValidationError } from 'yup';
import { v4 as uuid } from 'uuid';
import { getByTag } from 'locale-codes';

export type Error = {
  key: string;
  message: string;
};

export type FormOption = {
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

const NEW_OPTION = 'NEW_OPTION';

const getNewOption = (value: string, optionsLeft: FormOption[], values: FormOption[]): FormOption => {
  let id = `${NEW_OPTION}:${uuid()}`;
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

const formatTitle = (input: string) =>
  (() => {
    const formated = input
      .toLowerCase()
      .replace(/^(\s)*/g, '')
      .trim();
    return formated.charAt(0).toUpperCase().concat(formated.slice(1));
  })();

const getLangNameFromCode = (code: string) => formatTitle(getByTag(code)?.name) || 'Unknown';

export { validateSchema, getError, addError, getNewOption, formatTitle, getLangNameFromCode, NEW_OPTION };
export type {};
