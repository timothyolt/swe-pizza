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
