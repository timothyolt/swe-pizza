import { Pizza } from './pizza';
import { DatePipe } from '@angular/common';
import { Address } from './address';

export class Order {
  pizzas: Pizza[];
  createdAt: string;
  user: string;
  set createdAtDate(date: Date) {
    this.createdAt = new DatePipe('en-US').transform(date, 'yyyy-MM-ddTHH:mm:ss');
  }
  get createdAtDate() {
    return new Date(this.createdAt);
  }
  paidAt: string;
  set paidAtDate(date: Date) {
    this.paidAt = new DatePipe('en-US').transform(date, 'yyyy-MM-ddTHH:mm:ss');
  }
  get paidAtDate() {
    return new Date(this.paidAt);
  }
  total: number;
  delivery: boolean;
  payMethods: {[medthodId: string]: number};
}
