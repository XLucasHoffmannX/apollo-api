import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../modules/user/user.module';
import { ProductModule } from '../modules/product/product.module';
import { StoreModule } from '../modules/store/store.module';
import { CompanyModule } from '../modules/company/company.module';
import { ProductImageModule } from '../modules/product-image/product-image.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: true,
      entities: [__dirname + '/../**/*.entity{.js, .ts}'],
    }),
    UserModule,
    ProductModule,
    StoreModule,
    CompanyModule,
    ProductImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
