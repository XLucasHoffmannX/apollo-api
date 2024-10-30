import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { StoreEntity } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { CompanyEntity } from '../company/entities/company.entity';
import { StoreSetupEntity } from '../store-setup/entities/store-setup.entity';
import Theme from 'src/resources/shared/constants/Theme';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,

    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,

    @InjectRepository(StoreSetupEntity)
    private storeSetupRepository: Repository<StoreSetupEntity>,
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

      const store = await this.storeRepository.save(newStore);

      const themeVariables = new Theme().use('blue');

      const storeSetup = this.storeSetupRepository.create({
        store: store,
        themeType: 'blue',
        setup: {
          client: {
            clientName: createStoreDto.name,
            clientDescription: createStoreDto.description,
            titleHmtl: createStoreDto.title,
            clientDomain: createStoreDto.name,
          },
          theme: {
            light: themeVariables.light,
            dark: themeVariables.dark,
            header: {
              titleColor: createStoreDto.title || '#000',
              subTitleColor: '#333',
              logoAccept: true,
            },
          },
        },
      } as DeepPartial<StoreSetupEntity>);

      await this.storeSetupRepository.save(storeSetup);

      return store;
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
