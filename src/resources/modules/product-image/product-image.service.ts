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

@Injectable()
export class ProductImageService {
  constructor(
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

  async create(
    createProductImageDto: CreateProductImageDto,
    files: Express.Multer.File[],
  ) {
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
        product: { id: createProductImageDto.productId }, // Relaciona a imagem com o produto
        image: imageBuffer, // Armazena a imagem como Buffer no banco
        url: file.originalname, // Salva o nome original do arquivo (opcional)
      });

      productImages.push(productImage);
    }

    // Salva todas as imagens no banco de dados
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

  async remove(id: string) {
    const productImage = await this.findOne(id);
    return this.productImageRepository.remove(productImage);
  }
}
