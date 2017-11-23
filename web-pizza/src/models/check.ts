import { SecurePaymentMethod } from './payment-method';

export class Check extends SecurePaymentMethod {
  type = 'check';
  number: {
    bank: number;
    routing: number;
  };
}
