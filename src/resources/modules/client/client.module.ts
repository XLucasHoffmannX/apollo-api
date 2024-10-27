import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from '../store/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
