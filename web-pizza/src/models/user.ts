import { Address } from './address';

export class User {
    phone: number;
    address: Address;
    activeOrder: string;
    payMethods: {[medthodId: string]: boolean};
}
