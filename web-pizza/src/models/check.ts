import { SecurePaymentMethod } from './payment-method';

/** Instanciates an object type Check */
export class Check extends SecurePaymentMethod {
  /** Payment type */
  type = 'check';
  /** Check information */
  number: {
    /** Account number */
    bank: number;
    /** Bank routing number */
    routing: number;
  };
}
