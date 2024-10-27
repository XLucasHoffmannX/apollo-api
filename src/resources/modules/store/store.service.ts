import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreEntity } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { CompanyEntity } from '../company/entities/company.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,

    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: createStoreDto.companyId },
      });

      if (!company) {
        throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
      }

      const newStore = this.storeRepository.create({
        ...createStoreDto,
        company: company,
      });

      return await this.storeRepository.save(newStore);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.storeRepository.find();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findByCompany(id: string) {
    try {
      return await this.storeRepository.find({
        where: {
          company: {
            id: id,
          },
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async validateDomainService(domain: string) {
    try {
      // Procura se existe uma store com o domínio passado
      const existingStore = await this.storeRepository.findOne({
        where: { domain },
      });

      if (existingStore) {
        return { available: false, message: 'Domínio já em uso' };
      }

      return { available: true, message: 'Domínio disponível' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByCompany(storeId: string, companyId: string) {
    try {
      const store = await this.storeRepository.find({
        where: {
          id: storeId,
          company: {
            id: companyId,
          },
        },
      });

      return store[0];
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      const store = await this.storeRepository.findOne({ where: { id } });
      if (!store) {
        throw new HttpException('Loja não encontrada', HttpStatus.NOT_FOUND);
      }
      return store;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    try {
      console.log(updateStoreDto);
      const store = await this.storeRepository.findOne({ where: { id } });
      if (!store) {
        throw new HttpException('Loja não encontrada', HttpStatus.NOT_FOUND);
      }

      await this.storeRepository.update(id, updateStoreDto);
      return await this.storeRepository.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      const store = await this.storeRepository.findOne({ where: { id } });
      if (!store) {
        throw new HttpException('Loja não encontrada', HttpStatus.NOT_FOUND);
      }

      await this.storeRepository.delete(id);
      return { message: 'Loja removida com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /* AuthClient */
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
