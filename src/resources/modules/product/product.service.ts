import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { StoreEntity } from '../store/entities/store.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // Busca a loja pela ID e valida se ela pertence à empresa
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

      return await this.productRepository.save(newProduct);
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

  async findByCompany(companyId: string) {
    try {
      /* buscar todos os produtos de todas as stores de uma empresa */
      return await this.productRepository
        .createQueryBuilder('p')
        .innerJoin('p.store', 's')
        .innerJoin('s.company', 'c')
        .where('c.id = :companyId', { companyId })
        .getMany();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
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

      return products;
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
