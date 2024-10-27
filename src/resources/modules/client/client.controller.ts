import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';

import { AuthClientMiddleware } from 'src/resources/middlewares/auth-client.middleware';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(AuthClientMiddleware)
  @Get('/domains')
  findAllDomains() {
    return this.clientService.findAllDomains();
  }
}
