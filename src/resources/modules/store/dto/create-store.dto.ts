import { z } from 'zod';

export const createStoreSchema = z.object({
  companyId: z.string().uuid('ID da empresa inválido'),
  name: z.string().min(1, 'Nome é obrigatório').max(60, 'Nome muito longo'),
  domain: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(60, 'Dominio muito longo'),
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(60, 'Título muito longo'),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(120, 'Descrição muito longa'),
});

export type CreateStoreDto = z.infer<typeof createStoreSchema>;
