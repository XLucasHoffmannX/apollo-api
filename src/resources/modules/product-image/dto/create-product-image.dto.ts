import { z } from 'zod';

export const createProductImageSchema = z.object({
  productId: z.string().uuid('ID do produto inválido'),
});

export type CreateProductImageDto = z.infer<typeof createProductImageSchema>;
