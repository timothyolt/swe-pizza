import { Address } from './address';

/** Instanciates an object type User */
export class User {
    /** Phone number */
    phone: number;
    /** Shipping address */
    address: Address;
    /** Current active order key */
    activeOrder: string;
    /** List of payment methods on file */
    payMethods: {[medthodId: string]: boolean};
}
