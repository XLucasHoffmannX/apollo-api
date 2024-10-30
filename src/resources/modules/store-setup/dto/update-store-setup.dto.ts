import { z } from 'zod';
import { createStoreSetupSchema } from './create-store-setup.dto';

export const updateStoreSetupSchema = createStoreSetupSchema.partial();

export type UpdateStoreSetupDto = z.infer<typeof updateStoreSetupSchema>;
