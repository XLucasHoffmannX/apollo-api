import { z } from 'zod';

export const createProductImageSchema = z.object({
  productId: z.string().uuid('ID do produto inválido'),
  url: z.string().max(60, 'URL muito longa').optional(),
  image: z.instanceof(Buffer).optional(),
});

export type CreateProductImageDto = z.infer<typeof createProductImageSchema>;
