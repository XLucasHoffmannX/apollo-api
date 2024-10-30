import { z } from 'zod';

// Definindo os tipos de temas disponíveis
const ThemeTypeSchema = z.enum([
  'zinc',
  'slate',
  'stone',
  'gray',
  'neutral',
  'red',
  'rose',
  'orange',
  'green',
  'blue',
  'yellow',
  'violet',
]);

export const createStoreSetupSchema = z.object({
  storeId: z.string().uuid('ID da loja inválido'),
  setup: z.object({
    client: z.object({
      clientName: z.string(),
      clientLogo: z.string(),
      clientDescription: z.string(),
      titleHmtl: z.string(),
      clientDomain: z.string(),
      clientBackground: z.string().optional(),
      mediaLinks: z.array(z.string()).optional(),
      useBackgroundDefaultPage: z.boolean().optional(),
    }),
    theme: z.object({
      type: ThemeTypeSchema,
      header: z
        .object({
          titleColor: z.string(),
          subTitleColor: z.string(),
          logoAccept: z.boolean(),
        })
        .optional(),
    }),
  }),
});

export const updateStoreSetupSchema = createStoreSetupSchema.partial();

export type CreateStoreSetupDto = z.infer<typeof createStoreSetupSchema>;
