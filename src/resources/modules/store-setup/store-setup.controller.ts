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
import { StoreSetupService } from './store-setup.service';
import {
  CreateStoreSetupDto,
  createStoreSetupSchema,
} from './dto/create-store-setup.dto';
import { UpdateStoreSetupDto } from './dto/update-store-setup.dto';
import { AuthMiddleware } from 'src/resources/middlewares/auth.middleware';
import { ZodValidationPipe } from 'src/resources/shared/pipes';

@Controller('store-setup')
export class StoreSetupController {
  constructor(private readonly storeSetupService: StoreSetupService) {}

  @UseGuards(AuthMiddleware)
  @UsePipes(new ZodValidationPipe(createStoreSetupSchema))
  @Post()
  async create(@Body() createStoreSetupDto: CreateStoreSetupDto) {
    return await this.storeSetupService.create(createStoreSetupDto);
  }

  @Get()
  async findAll() {
    return await this.storeSetupService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.storeSetupService.findOne(id);
  }

  @UseGuards(AuthMiddleware)
  @Get('store/:storeId')
  async findByStoreId(@Param('storeId') storeId: string) {
    return await this.storeSetupService.findByStoreId(storeId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStoreSetupDto: UpdateStoreSetupDto,
  ) {
    return await this.storeSetupService.update(id, updateStoreSetupDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.storeSetupService.remove(id);
  }
}
