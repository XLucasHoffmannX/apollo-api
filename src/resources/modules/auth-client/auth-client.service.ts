import { Injectable } from '@nestjs/common';
import { CreateAuthClientDto } from './dto/create-auth-client.dto';
import { UpdateAuthClientDto } from './dto/update-auth-client.dto';

@Injectable()
export class AuthClientService {
  create(createAuthClientDto: CreateAuthClientDto) {
    return 'This action adds a new authClient';
  }

  findAll() {
    return `This action returns all authClient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authClient`;
  }

  update(id: number, updateAuthClientDto: UpdateAuthClientDto) {
    return `This action updates a #${id} authClient`;
  }

  remove(id: number) {
    return `This action removes a #${id} authClient`;
  }
}
