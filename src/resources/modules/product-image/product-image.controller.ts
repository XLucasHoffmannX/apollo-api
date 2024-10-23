import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UsePipes,
  UseInterceptors,
  UploadedFiles,
  Get,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductImageService } from './product-image.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import {
  UpdateProductImageDto,
  updateProductImageSchema,
} from './dto/update-product-image.dto';
import { ZodValidationPipe } from 'src/resources/shared/pipes';
import { AuthMiddleware } from 'src/resources/middlewares/auth.middleware';

@Controller('product-images')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Body() createProductImageDto: CreateProductImageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productImageService.create(createProductImageDto, files);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productImageService.findOne(id);
  }

  @Get('/show/:id')
  async findImage(@Param('id') id: string) {
    return this.productImageService.findImage(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateProductImageSchema))
  async update(
    @Param('id') id: string,
    @Body() updateProductImageDto: UpdateProductImageDto,
  ) {
    return this.productImageService.update(id, updateProductImageDto);
  }

  @UseGuards(AuthMiddleware)
  @Delete(':companyId/:id')
  remove(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.productImageService.remove(companyId, id);
  }
}
