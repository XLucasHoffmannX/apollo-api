import { z } from 'zod';
import { createOrderSchema } from './create-order.dto';

export const updateOrderSchema = createOrderSchema.partial();

export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;
