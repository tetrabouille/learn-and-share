import type { ObjectSchema } from 'yup';

export type Error = {
  key: string;
  message: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateSchema = (schema: ObjectSchema<any>, values: any, previousError: Error): Promise<Error> => {
  return schema
    .validate(values)
    .then(() => null as Error)
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (!previousError) {
          return {
            key: err.path,
            message: err.errors[0],
          };
        }
        if (previousError.key !== err.path) {
          return null;
        }
        return {
          key: err.path,
          message: err.errors[0],
        };
      }
      return null;
    });
};

export { validateSchema };
