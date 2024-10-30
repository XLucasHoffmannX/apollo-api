import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoreSetupDto } from './dto/create-store-setup.dto';
import { StoreEntity } from '../store/entities/store.entity';
import { StoreSetupEntity } from './entities/store-setup.entity';
import { UpdateStoreSetupDto } from './dto/update-store-setup.dto';
import Theme from 'src/resources/shared/constants/Theme';

@Injectable()
export class StoreSetupService {
  constructor(
    @InjectRepository(StoreSetupEntity)
    private readonly storeSetupRepository: Repository<StoreSetupEntity>,

    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  async create(
    createStoreSetupDto: CreateStoreSetupDto,
  ): Promise<StoreSetupEntity> {
    const { storeId, setup } = createStoreSetupDto;

    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(`Loja com ID ${storeId} não encontrada`);
    }

    const themeVariables = new Theme().use(setup.theme.type);

    const storeSetup = this.storeSetupRepository.create({
      store,
      themeType: setup.theme.type,
      setup: {
        ...setup,
        theme: {
          ...themeVariables,
          header: setup.theme.header,
        },
      },
    });

    return this.storeSetupRepository.save(storeSetup);
  }

  async findByStoreId(storeId: string): Promise<StoreSetupEntity> {
    const storeSetup = await this.storeSetupRepository.findOne({
      where: { store: { id: storeId } },
      relations: ['store'],
    });

    if (!storeSetup) {
      throw new NotFoundException(
        `Setup para a loja com ID ${storeId} não encontrado`,
      );
    }

    return storeSetup;
  }

  findAll(): Promise<StoreSetupEntity[]> {
    return this.storeSetupRepository.find({ relations: ['store'] });
  }

  async findOne(id: string): Promise<StoreSetupEntity> {
    const storeSetup = await this.storeSetupRepository.findOne({
      where: { id },
      relations: ['store'],
    });
    if (!storeSetup) {
      throw new NotFoundException(`Store setup com ID ${id} não encontrado`);
    }
    return storeSetup;
  }

  async update(
    id: string,
    updateStoreSetupDto: UpdateStoreSetupDto,
  ): Promise<StoreSetupEntity> {
    const storeSetup = await this.findOne(id);

    this.storeSetupRepository.merge(storeSetup, {
      ...updateStoreSetupDto,
      themeType: updateStoreSetupDto.setup?.theme.type,
    });
    return this.storeSetupRepository.save(storeSetup);
  }

  async remove(id: string): Promise<void> {
    const storeSetup = await this.findOne(id);
    await this.storeSetupRepository.remove(storeSetup);
  }
}
