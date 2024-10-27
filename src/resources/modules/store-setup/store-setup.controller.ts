import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoreSetupService } from './store-setup.service';
import { CreateStoreSetupDto } from './dto/create-store-setup.dto';
import { UpdateStoreSetupDto } from './dto/update-store-setup.dto';

@Controller('store-setup')
export class StoreSetupController {
  constructor(private readonly storeSetupService: StoreSetupService) {}

  @Post()
  create(@Body() createStoreSetupDto: CreateStoreSetupDto) {
    return this.storeSetupService.create(createStoreSetupDto);
  }

  @Get()
  findAll() {
    return this.storeSetupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeSetupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreSetupDto: UpdateStoreSetupDto) {
    return this.storeSetupService.update(+id, updateStoreSetupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeSetupService.remove(+id);
  }
}
