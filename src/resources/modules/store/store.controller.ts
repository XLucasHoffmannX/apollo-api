import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Query,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto, createStoreSchema } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AuthMiddleware } from 'src/resources/middlewares/auth.middleware';
import { ZodValidationPipe } from 'src/resources/shared/pipes';
import { AuthClientMiddleware } from 'src/resources/middlewares/auth-client.middleware';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @UseGuards(AuthMiddleware)
  @UsePipes(new ZodValidationPipe(createStoreSchema))
  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @UseGuards(AuthMiddleware)
  @Get('/validate-domain')
  validateDomain(@Query('domain') domain: string) {
    return this.storeService.validateDomainService(domain);
  }

  @UseGuards(AuthMiddleware)
  @Get('/all')
  findAll() {
    return this.storeService.findAll();
  }

  @UseGuards(AuthMiddleware)
  @Get(':id')
  findByCompany(@Param('id') id: string) {
    return this.storeService.findByCompany(id);
  }

  @UseGuards(AuthMiddleware)
  @Get('/:companyId/:storeId')
  findOneByCompany(
    @Param('storeId') storeId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.storeService.findOneByCompany(storeId, companyId);
  }

  @UseGuards(AuthMiddleware)
  @Get('/all/:id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @UseGuards(AuthMiddleware)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(id, updateStoreDto);
  }

  @UseGuards(AuthMiddleware)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }

  /* AuthClient */
  @UseGuards(AuthClientMiddleware)
  @Get('/domains')
  findAllDomains() {
    return this.storeService.findAllDomains();
  }
}
