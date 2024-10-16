import { Module } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { AuthClientController } from './auth-client.controller';

@Module({
  controllers: [AuthClientController],
  providers: [AuthClientService],
})
export class AuthClientModule {}
