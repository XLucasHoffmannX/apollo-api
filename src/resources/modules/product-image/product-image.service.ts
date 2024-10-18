import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImageEntity } from './entities/product-image.entity';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
  ) {}

  async create(createProductImageDto: CreateProductImageDto) {
    const productImage = this.productImageRepository.create(
      createProductImageDto,
    );
    return this.productImageRepository.save(productImage);
  }

  async findAll() {
    return this.productImageRepository.find();
  }

  async findOne(id: string) {
    const productImage = await this.productImageRepository.findOne({
      where: { id },
    });
    if (!productImage) {
      throw new NotFoundException('Image not found');
    }
    return productImage;
  }

  async update(id: string, updateProductImageDto: UpdateProductImageDto) {
    const productImage = await this.productImageRepository.preload({
      id,
      ...updateProductImageDto,
    });
    if (!productImage) {
      throw new NotFoundException('Image not found');
    }
    return this.productImageRepository.save(productImage);
  }

  async remove(id: string) {
    const productImage = await this.findOne(id);
    return this.productImageRepository.remove(productImage);
  }
}
