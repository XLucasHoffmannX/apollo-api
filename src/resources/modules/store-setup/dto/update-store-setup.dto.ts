import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreSetupDto } from './create-store-setup.dto';

export class UpdateStoreSetupDto extends PartialType(CreateStoreSetupDto) {}
