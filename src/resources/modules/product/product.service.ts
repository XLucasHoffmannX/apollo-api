import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { StoreEntity } from '../store/entities/store.entity';
import { ProductImageEntity } from '../product-image/entities/product-image.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,

    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
  ) {}

  validateImageMimeType(image: Buffer): boolean {
    const mimeType = image.toString('hex', 0, 4);
    const validMimeTypes = [
      '89504e47', // PNG
      'ffd8ffe0',
      'ffd8ffe1',
      'ffd8ffe2',
      'ffd8ffe3',
      'ffd8ffe8', // JPG/JPEG
    ];
    return validMimeTypes.includes(mimeType);
  }

  private convertImageToBase64(image: Buffer): string {
    const mimeType = this.validateImageMimeType(image)
      ? 'image/jpeg'
      : 'image/png';
    const base64Image = image.toString('base64');
    return `data:${mimeType};base64,${base64Image}`;
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const store = await this.storeRepository.findOne({
        where: {
          id: createProductDto.storeId,
          company: { id: createProductDto.companyId },
        },
        relations: ['company'],
      });

      if (!store) {
        throw new HttpException(
          'Loja não encontrada ou não pertence à empresa fornecida',
          HttpStatus.NOT_FOUND,
        );
      }

      const newProduct = this.productRepository.create({
        ...createProductDto,
        store: store,
      });

      const savedProduct = await this.productRepository.save(newProduct);

      return savedProduct;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.productRepository.find();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findByCompany(companyId: string, options: IPaginationOptions) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('p')
      .innerJoin('p.store', 'store')
      .innerJoin('store.company', 'company')
      .where('company.id = :companyId', { companyId })
      .leftJoinAndSelect('p.images', 'images')
      .orderBy('p.createdAt', 'DESC');

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
  }

  async findOne(id: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });

      if (!product) {
        throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
      }

      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findByStore(storeId: string) {
    try {
      const products = await this.productRepository.find({
        where: { store: { id: storeId } },
        relations: ['store', 'images'],
      });

      if (!products.length) {
        throw new HttpException(
          'Nenhum produto encontrado para esta loja',
          HttpStatus.NOT_FOUND,
        );
      }

      return products.map((product) => ({
        ...product,
        images: product.images.map((image) => {
          const mimeType = this.validateImageMimeType(image.image)
            ? 'image/jpeg'
            : 'image/png';
          const base64Image = image.image.toString('base64');
          return `data:${mimeType};base64,${base64Image}`;
        }),
      }));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
      }

      await this.productRepository.update(id, updateProductDto);
      return await this.productRepository.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
      }

      await this.productRepository.delete(id);
      return { message: 'Produto removido com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
