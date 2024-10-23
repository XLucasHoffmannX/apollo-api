import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { ProductImageEntity } from './entities/product-image.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../company/entities/company.entity';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,

    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
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

  async create(
    createProductImageDto: CreateProductImageDto,
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new HttpException(
        'Nenhuma imagem foi enviada',
        HttpStatus.BAD_REQUEST,
      );
    }

    const productImages: ProductImageEntity[] = [];

    for (const file of files) {
      const imageBuffer = file.buffer;

      // Valida se o arquivo é uma imagem válida
      const isImage = this.validateImageMimeType(imageBuffer);
      if (!isImage) {
        throw new HttpException(
          `O arquivo ${file.originalname} não é uma imagem válida`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const productImage = this.productImageRepository.create({
        product: { id: createProductImageDto.productId },
        image: imageBuffer,
        url: file.originalname,
      });

      productImages.push(productImage);
    }

    return this.productImageRepository.save(productImages);
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

  async findImage(id: string) {
    const productImage = await this.productImageRepository.findOne({
      where: { id },
    });

    if (!productImage) {
      throw new NotFoundException('Imagem não encontrada');
    }

    const mimeType = this.validateImageMimeType(productImage.image)
      ? 'image/jpeg' // Supondo que a imagem seja JPEG. Você pode ajustar isso para PNG conforme necessário.
      : 'image/png';

    const base64Image = productImage.image.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    return {
      id: productImage.id,
      imageUrl: dataUrl,
      url: productImage.url,
    };
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

  async remove(companyId: string, id: string) {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
      });

      if (!company) {
        throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
      }

      const productImage = await this.findOne(id);
      return this.productImageRepository.softRemove(productImage);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
