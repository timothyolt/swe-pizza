import { PaymentMethod } from './payment-method';

/** Instanciates an object type Cash */
export class Cash extends PaymentMethod {
  /** Payment type */
  type = 'cash';
}
