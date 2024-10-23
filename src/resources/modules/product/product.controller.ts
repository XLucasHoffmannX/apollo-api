import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  createProductSchema,
} from './dto/create-product.dto';
import {
  UpdateProductDto,
  updateProductSchema,
} from './dto/update-product.dto';
import { ZodValidationPipe } from 'src/resources/shared/pipes';
import { AuthMiddleware } from 'src/resources/middlewares/auth.middleware';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthMiddleware)
  @Post()
  @UsePipes(new ZodValidationPipe(createProductSchema))
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @UseGuards(AuthMiddleware)
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  /* Busca todos os produtos por StoreId */
  @UseGuards(AuthMiddleware)
  @Get('store/:storeId')
  findByStore(@Param('storeId') storeId: string) {
    return this.productService.findByStore(storeId);
  }

  /* Busca todos os produtos por CompanyId */
  @UseGuards(AuthMiddleware)
  @Get(':companyId')
  findByCompany(
    @Param('companyId') companyId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
    @Req() req,
    @Query('search') search?: string,
  ) {
    return this.productService.findByCompany(
      companyId,
      {
        page,
        limit,
        route: `${req.protocol}://${req.get('host')}/products/`,
      },
      search,
    );
  }

  @Get('/all/:id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch('/all/:id')
  @UsePipes(new ZodValidationPipe(updateProductSchema))
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @UseGuards(AuthMiddleware)
  @Delete(':companyId/:id')
  remove(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.productService.remove(companyId, id);
  }
}
