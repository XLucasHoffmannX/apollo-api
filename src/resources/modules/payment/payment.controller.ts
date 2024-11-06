import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentLinkDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('create-link')
  async createPaymentLink(@Body() createPaymentLinkDto: CreatePaymentLinkDto): Promise<string> {
    return this.paymentService.createPaymentLink(createPaymentLinkDto);
  }
}