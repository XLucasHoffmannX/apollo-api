import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImageEntity } from './entities/product-image.entity';
import { CompanyEntity } from '../company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImageEntity, CompanyEntity])],
  controllers: [ProductImageController],
  providers: [ProductImageService],
})
export class ProductImageModule {}
