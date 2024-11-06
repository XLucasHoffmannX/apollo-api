import { PaymentData } from "./payment-data.interface";

export class CreatePaymentLinkDto {
    companyId: string;
    paymentData: PaymentData;
}