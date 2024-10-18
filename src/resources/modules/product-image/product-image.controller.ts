import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UsePipes,
} from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import {
  CreateProductImageDto,
  createProductImageSchema,
} from './dto/create-product-image.dto';
import {
  UpdateProductImageDto,
  updateProductImageSchema,
} from './dto/update-product-image.dto';
import { ZodValidationPipe } from 'src/resources/shared/pipes';

@Controller('product-images')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createProductImageSchema))
  async create(@Body() createProductImageDto: CreateProductImageDto) {
    return this.productImageService.create(createProductImageDto);
  }

  @Get()
  async findAll() {
    return this.productImageService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productImageService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateProductImageSchema))
  async update(
    @Param('id') id: string,
    @Body() updateProductImageDto: UpdateProductImageDto,
  ) {
    return this.productImageService.update(id, updateProductImageDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productImageService.remove(id);
  }
}
