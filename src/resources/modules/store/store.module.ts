import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { StoreEntity } from './entities/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from '../company/entities/company.entity';
import { StoreSetupEntity } from '../store-setup/entities/store-setup.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreEntity, CompanyEntity, StoreSetupEntity]),
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
