import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StoreEntity } from '../store/entities/store.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Theme from 'src/resources/shared/constants/Theme';
import { ThemeType } from '../store-setup/entities/store-setup.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  validateImageMimeType(image: Buffer): boolean {
    const mimeType = image.toString('hex', 0, 4);
    const validMimeTypes = [
      '89504e47',
      'ffd8ffe0',
      'ffd8ffe1',
      'ffd8ffe2',
      'ffd8ffe3',
      'ffd8ffe8',
    ];

    return validMimeTypes.includes(mimeType);
  }

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

  async findByStore(
    storeId: string,
    options: IPaginationOptions,
    search?: string,
  ) {
    try {
      const queryBuilder = this.productRepository
        .createQueryBuilder('p')
        .innerJoinAndSelect('p.store', 'store')
        .leftJoinAndSelect('p.images', 'images')
        .where('store.id = :storeId', { storeId });

      if (search) {
        queryBuilder.andWhere('p.name ILIKE :search', {
          search: `%${search}%`,
        });
      }

      queryBuilder.orderBy('p.createdAt', 'DESC');

      const products = await paginate<ProductEntity>(queryBuilder, options);

      const paginatedProducts = products.items.map((product) => ({
        ...product,
        images: product.images.map((image) => {
          const mimeType = this.validateImageMimeType(image.image)
            ? 'image/jpeg'
            : 'image/png';
          const base64Image = image.image.toString('base64');
          return `data:${mimeType};base64,${base64Image}`;
        }),
      }));

      return {
        ...products,
        items: paginatedProducts,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
