import { Module } from '@nestjs/common';
import { StoreSetupService } from './store-setup.service';
import { StoreSetupController } from './store-setup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreSetupEntity } from './entities/store-setup.entity';
import { StoreEntity } from '../store/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreSetupEntity, StoreEntity])],
  controllers: [StoreSetupController],
  providers: [StoreSetupService],
})
export class StoreSetupModule {}
