import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthClientDto } from './create-auth-client.dto';

export class UpdateAuthClientDto extends PartialType(CreateAuthClientDto) {}
