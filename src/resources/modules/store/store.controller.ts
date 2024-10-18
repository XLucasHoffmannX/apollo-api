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
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto, createStoreSchema } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AuthMiddleware } from 'src/resources/middlewares/auth.middleware';
import { ZodValidationPipe } from 'src/resources/shared/pipes';

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
  @Get('/:companyId/:id')
  findOneByCompany(
    @Param('id') id: string,
    @Param('companyId') companyId: string,
  ) {
    return this.storeService.findOneByCompany(id, companyId);
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
}
