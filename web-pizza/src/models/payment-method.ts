import { Address } from './address';

/** Instanciates a PaymentMethod */
export abstract class PaymentMethod {
  /** Payment method type */
  protected abstract type: string;
}

/** Instanciates an object type SecurePaymentMethod */
export abstract class SecurePaymentMethod extends PaymentMethod {
  /** Name of user on payment method */
  name: string;
  /** Billing address */
  address: Address;
  /** User id */
  user: string;
}
