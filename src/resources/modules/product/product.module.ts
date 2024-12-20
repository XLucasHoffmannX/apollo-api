import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { StoreEntity } from '../store/entities/store.entity';
import { CompanyEntity } from '../company/entities/company.entity';
import { ProductImageEntity } from '../product-image/entities/product-image.entity';
import { StoreSetupEntity } from '../store-setup/entities/store-setup.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      StoreEntity,
      CompanyEntity,
      ProductImageEntity,
      StoreSetupEntity,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
