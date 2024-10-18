import { z } from 'zod';

// Definir o schema original
export const createProductImageSchema = z.object({
  productId: z.string().uuid('ID do produto inválido'),
  url: z.string().max(60, 'URL muito longa').optional(),
  image: z.instanceof(Buffer).optional(),
});

// Criar a versão parcial do schema (para update)
export const updateProductImageSchema = createProductImageSchema.partial();

// Aplicar o refinamento (efeito) depois de torná-lo parcial
export const refinedUpdateProductImageSchema = updateProductImageSchema.refine(
  (data) => !!data.url || !!data.image,
  {
    message: 'É necessário fornecer uma URL ou uma imagem',
    path: ['url'],
  },
);

export type UpdateProductImageDto = z.infer<
  typeof refinedUpdateProductImageSchema
>;
