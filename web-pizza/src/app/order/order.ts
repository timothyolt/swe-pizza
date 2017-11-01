import { Pizza } from '../pizza/pizza';

export class Order {
  id: string;
  pizzas: Pizza[];
  createdAt: string;
  set createdAtDate(date: Date) {
    this.createdAt =
      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` +
      `:${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  paidAt: string;
  paymentType: string; // check, cash or card
  total: number;
  type: string; // delivery or pickup
}
