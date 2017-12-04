import { SecurePaymentMethod } from './payment-method';

/** Instanciates an object type Card */
export class Card extends SecurePaymentMethod {
    /** Payment type */
    type = 'card';
    /** Card infomation */
    number: {
      /** Card number */
      card: string;
      /** Expiration information */
      expiration: {
        /** Expiration month */
        month: number;
        /** Expiration year */
        year: number;
      };
      /** Security CVC */
      cvc: number;
    };
}
