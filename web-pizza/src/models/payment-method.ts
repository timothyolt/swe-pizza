import { Address } from './address';

export abstract class PaymentMethod {
  protected abstract type: string;
}

export abstract class SecurePaymentMethod extends PaymentMethod {
  name: string;
  address: Address;
  user: string;
}
