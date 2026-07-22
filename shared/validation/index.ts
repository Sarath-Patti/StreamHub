import { z, ZodSchema } from 'zod';
import { ValidationError } from '../errors';

export const validateInput = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError('Input validation failed', result.error.errors);
  }
  return result.data;
};

export const validateEnv = <T>(schema: ZodSchema<T>, envData: unknown): T => {
  const result = schema.safeParse(envData);
  if (!result.success) {
    throw new Error(`Environment validation failed: ${JSON.stringify(result.error.format())}`);
  }
  return result.data;
};

export const validateDTO = <T>(schema: ZodSchema<T>, data: unknown): T => {
  return validateInput(schema, data);
};

export { z };
