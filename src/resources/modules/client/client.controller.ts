import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  @UseGuards(AuthClientMiddleware)
  @Get('/domains/:domain')
  async findByDomain(@Param('domain') domain: string) {
    return await this.clientService.findByDomain(domain);
  }

  @UseGuards(AuthClientMiddleware)
  @Get('/product/:store')
  async productByStore(
    @Param('store') store: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Req() req,
    @Query('search') search?: string,
  ) {
    return await this.clientService.findByStore(
      store,
      {
        page,
        limit,
        route: `${req.protocol}://${req.get('host')}/product/${store}`,
      },
      search,
    );
  }
}
