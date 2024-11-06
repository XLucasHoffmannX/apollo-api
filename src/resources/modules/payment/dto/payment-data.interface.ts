export interface PaymentConfig {
    boleto?: {
        enabled: boolean;
        expires_in: number;
    };
    credit_card?: {
        enabled: boolean;
        free_installments: number;
        interest_rate: number;
        max_installments: number;
    };
    pix?: {
        enabled: boolean;
        expiration_date: string;
    };
}

export interface PaymentItem {
    id: string;
    title: string;
    unit_price: number;
    quantity: number;
    tangible: boolean;
}

export interface PaymentCustomer {
    name: string;
    email: string;
}

export interface PaymentData {
    amount: number;
    payment_config: PaymentConfig;
    items: PaymentItem[];
    customer: PaymentCustomer;
}