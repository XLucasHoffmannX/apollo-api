import { z } from 'zod';
import { OrderStatus } from '../entities/order.entity';

const requiredError = 'Campo obrigatório';

export const createOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  storeId: z.string({ required_error: requiredError }).uuid(),
  productId: z.string().optional(), // Produto pode ser opcional
  costumer: z.string({ required_error: requiredError }).min(1),
  address: z.string({ required_error: requiredError }).min(1),
  paymentMethod: z.string().optional(),
  price: z.number({ required_error: requiredError }).min(0),
  discount: z.number().min(0).default(0),
  totalPrice: z.number({ required_error: requiredError }).min(0),
  quantity: z.number({ required_error: requiredError }).min(1),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
