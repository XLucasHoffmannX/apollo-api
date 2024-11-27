import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../company/entities/company.entity';
import { PaymentEntity } from './entities/payment.entity';
import { CreatePaymentLinkDto } from './dto/payment.dto';
import pagarme from 'pagarme';

@Injectable()
export class PaymentService {
  private readonly apiKey = process.env.PAGARME_API_KEY;

  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,

    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
  ) {}

  async createPaymentLink(
    createPaymentLinkDto: CreatePaymentLinkDto,
  ): Promise<string> {
    const { companyId, paymentData } = createPaymentLinkDto;

    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
      });

      if (!company) {
        throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
      }

      const client = await pagarme.client.connect({ api_key: this.apiKey });
      const link = await client.paymentLinks.create(paymentData);

      const payment = new PaymentEntity();
      payment.paymentData = paymentData;
      payment.paymentUrl = link.url;
      await this.paymentRepository.save(payment);

      return link.url;
    } catch (error) {
      console.error(
        'Erro ao criar link de pagamento: ',
        error.response ? error.response : error,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
