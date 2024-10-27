import { z } from 'zod';

const requiredError = 'Campo obrigatório';

export const createSchema = z
  .object({
    client: z.string({ required_error: requiredError }),
    password: z.string({ required_error: requiredError }),
  })
  .required();

export type CreateDto = z.infer<typeof createSchema>;
