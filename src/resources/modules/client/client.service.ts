import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StoreEntity } from '../store/entities/store.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Theme from 'src/resources/shared/constants/Theme';
import { ThemeType } from '../store-setup/entities/store-setup.entity';

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

  async findByDomain(domain: string) {
    try {
      const store = await this.storeRepository.findOne({
        where: { domain },
        relations: ['company', 'storeSetup'],
      });

      if (!store) {
        throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
      }

      const themeVariables = new Theme().use(
        store.storeSetup.themeType as ThemeType,
      );

      return { store: store, theme: themeVariables };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
