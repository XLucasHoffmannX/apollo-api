import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { CreateDto, createSchema } from './dto/create-auth-client.dto';
import { ZodValidationPipe } from 'src/resources/shared/pipes';

@Controller('auth-client')
export class AuthClientController {
  constructor(private readonly authClientService: AuthClientService) {}

  @Post('/')
  @UsePipes(new ZodValidationPipe(createSchema))
  auth(@Body() createDto: CreateDto) {
    return this.authClientService.authService(createDto);
  }

  @Post('/create')
  @UsePipes(new ZodValidationPipe(createSchema))
  create(@Body() createDto: CreateDto) {
    return this.authClientService.createService(createDto);
  }
}
