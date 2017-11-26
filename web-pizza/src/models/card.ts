import { SecurePaymentMethod } from './payment-method';

export class Card extends SecurePaymentMethod {
    type = 'card';
    number: {
      card: string;
      expiration: {
        month: number;
        year: number;
      };
      cvc: number;
    };
}
