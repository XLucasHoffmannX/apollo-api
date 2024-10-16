import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(60, 'Nome muito longo'),
  price: z.number().min(0, 'Preço deve ser positivo'),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(140, 'Descrição muito longa'),
  content: z
    .string()
    .min(1, 'Conteúdo é obrigatório')
    .max(280, 'Conteúdo muito longo'),
  available: z.number().min(0, 'Quantidade disponível deve ser positiva'),
  discount: z.number().min(0, 'Desconto deve ser positivo'),
  quantity: z.number().min(0, 'Quantidade deve ser positiva'),
  minQuantity: z.number().min(0, 'Quantidade mínima deve ser positiva'),
  category: z.string().optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
