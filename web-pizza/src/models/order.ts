import { Pizza } from './pizza';
import { DatePipe } from '@angular/common';
import { Address } from './address';

/** Instanciates an object type Order */
export class Order {
  /** Order address */
  address: Address;
  /** Pizzas in cart */
  pizzas: Pizza[];
  /** Time order was placed */
  createdAt: string;
  /** User id accociated with order */
  user: string;
  /** Set order creation date */
  set createdAtDate(date: Date) {
    this.createdAt = new DatePipe('en-US').transform(date, 'yyyy-MM-ddTHH:mm:ss');
  }
  /** Get order creation date */
  get createdAtDate() {
    return new Date(this.createdAt);
  }
  /** Date order was paid for */
  paidAt: string;
  /** Set order paid for date */
  set paidAtDate(date: Date) {
    this.paidAt = new DatePipe('en-US').transform(date, 'yyyy-MM-ddTHH:mm:ss');
  }
  /** Get order paid for date */
  get paidAtDate() {
    return new Date(this.paidAt);
  }
  /** Total cost of order */
  total: number;
  /** Is order set for pickup or delivery */
  delivery: boolean;
  /** Payment method used on order */
  payMethods: {[medthodId: string]: number};
}
