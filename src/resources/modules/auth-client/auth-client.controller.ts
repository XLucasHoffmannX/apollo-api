import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { CreateAuthClientDto } from './dto/create-auth-client.dto';
import { UpdateAuthClientDto } from './dto/update-auth-client.dto';

@Controller('auth-client')
export class AuthClientController {
  constructor(private readonly authClientService: AuthClientService) {}

  @Post()
  create(@Body() createAuthClientDto: CreateAuthClientDto) {
    return this.authClientService.create(createAuthClientDto);
  }

  @Get()
  findAll() {
    return this.authClientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authClientService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthClientDto: UpdateAuthClientDto) {
    return this.authClientService.update(+id, updateAuthClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authClientService.remove(+id);
  }
}
