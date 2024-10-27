import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StoreEntity } from '../store/entities/store.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  async findAllDomains(): Promise<string[]> {
    try {
      const stores = await this.storeRepository.find({
        select: ['domain'],
      });
      return stores.map((store) => store.domain);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
