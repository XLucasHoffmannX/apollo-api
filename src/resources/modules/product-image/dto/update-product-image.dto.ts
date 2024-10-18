import { z } from 'zod';
import { createProductImageSchema } from './create-product-image.dto';

export const updateProductImageSchema = createProductImageSchema.partial();

export type UpdateProductImageDto = z.infer<typeof updateProductImageSchema>;
