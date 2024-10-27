import { Module } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { AuthClientController } from './auth-client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthClientEntity } from './entities/auth-client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthClientEntity])],
  controllers: [AuthClientController],
  providers: [AuthClientService],
})
export class AuthClientModule {}
