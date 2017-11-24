import { Pizza } from './pizza';

export class Order {
  pizzas: Pizza[];
  createdAt: string;
  user: string;
  set createdAtDate(date: Date) {
    this.createdAt =
      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` +
      `T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  get createdAtDate() {
    return new Date(this.createdAt);
  }
  paidAt: string;
  set paidAtDate(date: Date) {
    this.paidAt =
      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` +
      `T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  get paidAtDate() {
    return new Date(this.paidAt);
  }
  total: number;
  type: string; // delivery or pickup
  payMethods: {[medthodId: string]: number};
}
