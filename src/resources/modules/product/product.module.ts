import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { StoreEntity } from '../store/entities/store.entity';
import { CompanyEntity } from '../company/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, StoreEntity, CompanyEntity]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
