import { SecurePaymentMethod } from './payment-method';

export class Card extends SecurePaymentMethod {
    type = 'card';
    number: {
      card: number;
      expiration: {
        month: number;
        year: number;
      };
      cvc: number;
    };
}

export class PartialCard {
  type = 'card';
  number: Partial<{
    card: number;
    expiration: Partial<{
      month: number;
      year: number;
    }>;
    cvc: number;
  }>;
}
