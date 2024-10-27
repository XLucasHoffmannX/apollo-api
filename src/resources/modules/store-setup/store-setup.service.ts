import { Injectable } from '@nestjs/common';
import { CreateStoreSetupDto } from './dto/create-store-setup.dto';
import { UpdateStoreSetupDto } from './dto/update-store-setup.dto';

@Injectable()
export class StoreSetupService {
  create(createStoreSetupDto: CreateStoreSetupDto) {
    return 'This action adds a new storeSetup';
  }

  findAll() {
    return `This action returns all storeSetup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storeSetup`;
  }

  update(id: number, updateStoreSetupDto: UpdateStoreSetupDto) {
    return `This action updates a #${id} storeSetup`;
  }

  remove(id: number) {
    return `This action removes a #${id} storeSetup`;
  }
}
