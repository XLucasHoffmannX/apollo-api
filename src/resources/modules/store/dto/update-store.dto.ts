import { z } from 'zod';
import { createStoreSchema } from './create-store.dto';

export const updateStoreSchema = createStoreSchema.partial();

export type UpdateStoreDto = z.infer<typeof updateStoreSchema>;
