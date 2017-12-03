import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { Pizza } from '../../models/pizza';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Address } from '../../models/address';
import { Card } from '../../models/card';
import { Check } from '../../models/check';
import { Cash } from '../../models/cash';
import 'rxjs/add/operator/shareReplay';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;
import DataSnapshot = firebase.database.DataSnapshot;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
  authSubscription: Subscription;
  addressSubscription: Subscription;
  paymentSubscription: Subscription;
  itemCatsSubscription: Subscription;
  activeOrderRef: Reference;
  pizzaRef: Reference;

  isOrderOpen = true;
  isDeliveryOpen = false;
  isPaymentOpen = false;

  orderRef: string;
  cost: Observable<number>;
  total: Observable<number>;
  pizzas: Pizza[] = [];
  itemCats: Observable<SnapshotAction[]>;

  isDelivery: Observable<boolean>;
  addressRef: AngularFireObject<Address>;
  address: Observable<Address>;
  addressPartial: any = {};
  states = ['NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI',
    'VA', 'WA', 'WV', 'WI', 'WY', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN',
    'MS', 'MO', 'MT', 'NE', 'NV', 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM'];
  stateRegex = new RegExp(['^(NH)|(NJ)|(NM)|(NY)|(NC)(ND)|(MP)|(OH)|(OK)|(OR)|(PW)|(PA)|(PR)|(RI)|(SC)|(SD)|(TN)|(TX)|(UT)|(VT)|(VI)|(VA)|',
    '(WA)|(WV)|(WI)|(WY)|(FL)|(GA)|(GU)|(HI)|(ID)|(IL)|(IN)|(IA)|(KS)|(KY)|(LA)|(ME)|(MH)|(MD)|(MA)|(MI)|(MN)|(MS)|(MO)|(MT)|(NE)|(NV)|',
    '(AL)|(AK)|(AS)|(AZ)|(AR)|(CA)|(CO)|(CT)|(DE)|(DC)|(FM)$'].join(''));
  addressValidated = false;
  apartmentValidated = false;
  cityValidated = false;
  stateValidated = false;
  zipValidated = false;
  addressValid: boolean;
  apartmentValid = true; // not required, starts valid to prevent having to touch input field
  cityValid: boolean;
  stateValid: boolean;
  zipValid: boolean;

  paymentRef: AngularFireObject<Check | Card | Cash>;
  payment: Observable<Check | Card | Cash>;
  paymentPartial: any = {};
  cardRegex = new RegExp('^([0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4})|([0-9]{16})$');
  expMonths = [
    {value: '01', name: 'January'},
    {value: '02', name: 'February'},
    {value: '03', name: 'March'},
    {value: '04', name: 'April'},
    {value: '05', name: 'May'},
    {value: '06', name: 'June'},
    {value: '07', name: 'July'},
    {value: '08', name: 'August'},
    {value: '09', name: 'September'},
    {value: '10', name: 'October'},
    {value: '11', name: 'November'},
    {value: '12', name: 'December'}];
  nameValidated = false;
  routingValidated = false;
  bankValidated = false;
  cardValidated = false;
  expMonthValidated = false;
  expYearValidated = false;
  cvcValidated = false;
  nameValid: boolean;
  routingValid: boolean;
  bankValid: boolean;
  cardValid: boolean;
  expMonthValid: boolean;
  expYearValid: boolean;
  cvcValid: boolean;

  constructor(private auth: AngularFireAuth, private db: AngularFireDatabase) { }

  ngOnInit() {
    this.authSubscription = this.auth.authState.subscribe(user => {
      if (user) {
        console.log('using user for order: ' + user.uid);
        this.setupOrder(user.uid);
      } else {
        console.log('creating anonymous user for order');
        if (this.addressSubscription)
          this.addressSubscription.unsubscribe();
        if (this.paymentSubscription)
          this.paymentSubscription.unsubscribe();
        if (this.itemCatsSubscription)
          this.itemCatsSubscription.unsubscribe();
        if (this.activeOrderRef)
          this.activeOrderRef.off();
        if (this.pizzaRef)
          this.pizzaRef.off();
        this.auth.auth.signInAnonymously().catch(console.log);
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription)
      this.authSubscription.unsubscribe();
    if (this.addressSubscription)
      this.addressSubscription.unsubscribe();
    if (this.paymentSubscription)
      this.paymentSubscription.unsubscribe();
    if (this.itemCatsSubscription)
      this.itemCatsSubscription.unsubscribe();
    if (this.activeOrderRef)
      this.activeOrderRef.off();
    if (this.pizzaRef)
      this.pizzaRef.off();
  }

  private setupOrder(userId: string) {
    if (this.activeOrderRef)
      this.activeOrderRef.off();
    this.activeOrderRef = this.db.database.ref('/users/' + userId + '/activeOrder');
    this.activeOrderRef.on('value', activeOrder => this.onActiveOrder(userId, activeOrder));
    this.itemCats = this.db.list('/itemCat').snapshotChanges().shareReplay(1);
    if (this.itemCatsSubscription)
      this.itemCatsSubscription.unsubscribe();
    this.itemCatsSubscription = this.itemCats.subscribe(console.log);
  }

  onActiveOrder(userId: string, activeOrder: DataSnapshot) {
    if (activeOrder.exists()) {
      this.orderRef = '/orders/' + activeOrder.val();
    } else {
      const order: Partial<Order> = {
        createdAt: new DatePipe('en-US').transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
        user: userId,
        delivery: true
      };
      console.log(order);
      const orderId = this.db.database.ref('/orders').push(order, error => {
        if (!error) {
          this.activeOrderRef.set(orderId).catch(console.log);
        }
      }).key;
      this.orderRef = '/orders/' + orderId;
      this.addNewPizza();
    }
    this.cost = this.db.object(this.orderRef + '/cost').valueChanges().shareReplay(1);
    this.total = this.db.object(this.orderRef + '/total').valueChanges().shareReplay(1);
    this.isDelivery = this.db.object(this.orderRef + '/delivery').valueChanges().shareReplay(1);
    this.addressRef = this.db.object(this.orderRef + '/address');
    this.address = this.addressRef.valueChanges().shareReplay(1);
    if (this.addressSubscription)
      this.addressSubscription.unsubscribe();
    this.addressSubscription = this.address.subscribe(address => this.validateAddressForm(address));
    this.paymentRef = this.db.object(this.orderRef + '/payment');
    this.payment = this.paymentRef.valueChanges().shareReplay(1);
    if (this.paymentSubscription)
      this.paymentSubscription.unsubscribe();
    this.paymentSubscription = this.payment.subscribe(payment => this.validatePaymentForm(payment));
    this.pizzaRef = this.db.database.ref(this.orderRef + '/pizzas');
    if (this.pizzaRef)
      this.pizzaRef.off();
    this.pizzas = [];
    this.pizzaRef.on('child_added', pizza => {
      console.log('pizza added: ', pizza ? pizza.val() : null);
      if (!this.pizzas) {
        this.pizzas = [];
      }
      const pizzaVal = pizza.val();
      pizzaVal['$key'] = pizza.key;
      this.pizzas.splice(Number(pizza.key), 0, pizzaVal);
    });
    this.pizzaRef.on('child_removed', pizza => {
      console.log('pizza removed: ', pizza ? pizza.val() : null);
      this.pizzas.splice(Number(pizza.key), 1);
    });
  }

  saveIsDelivery(isDelivery: boolean) {
    console.log('order delivery update');
    console.log(isDelivery);
    this.db.database.ref(this.orderRef).update({delivery: isDelivery}).catch(console.log);
  }

  resetAddressFormValidated() {
    this.addressValidated = false;
    this.apartmentValidated = false;
    this.cityValidated = false;
    this.stateValidated = false;
    this.zipValidated = false;
  }

  validateAddressForm(address: Address) {
    this.validateAddress(address ? address.line1 : null);
    this.validateApartment(address ? address.line2 : null);
    this.validateCity(address ? address.city : null);
    this.validateState(address ? address.state : null);
    this.validateZip(address ? address.zip : null);
  }

  onInputAddress(value: string, final = false) {
    if (final) {
      this.addressValidated = true;
    }
    this.validateAddress(value);
    if (this.addressValid) {
      this.addressPartial.line1 = value;
    }
  }

  private validateAddress(value: string | null) {
    this.addressValid = value && value.length > 0 && value.length <= 240;
  }

  onInputApartment(value: string, final = false) {
    if (final) {
      this.apartmentValidated = true;
    }
    this.validateApartment(value);
    if (this.apartmentValid) {
      this.addressPartial.line2 = value;
    }
  }

  private validateApartment(value: string | null) {
    this.apartmentValid = value ? value.length <= 240 : true;
  }

  onInputCity(value: string, final = false) {
    if (final) {
      this.cityValidated = true;
    }
    this.validateCity(value);
    if (this.cityValid) {
      this.addressPartial.city = value;
    }
  }

  private validateCity(value: string | null) {
    this.cityValid = value && value.length > 0 && value.length <= 240;
  }

  onInputState(value: string, final = false) {
    if (final) {
      this.stateValidated = true;
    }
    this.validateState(value);
    if (this.stateValid) {
      this.addressPartial.state = value;
    }
  }

  private validateState(value: string | null) {
    this.stateValid = value && this.stateRegex.test(value);
  }

  onInputZip(value: string, final = false) {
    if (final) {
      this.zipValidated = true;
    }
    const zip = Number(value);
    this.validateZip(zip);
    if (this.zipValid) {
      this.addressPartial.zip = zip;
    }
  }

  private validateZip(zip: number | null) {
    this.zipValid = zip && zip >= 0 && zip <= 99999;
  }

  saveAddress() {
    console.log('order address update');
    console.log(this.addressPartial);
    this.addressRef.query.ref.update(this.addressPartial).catch(console.log);
    this.addressPartial = {};
  }

  savePaymentType(paymentType: string) {
    console.log('order payment type update');
    console.log(paymentType);
    this.paymentRef.update({type: paymentType}).catch(console.log);
  }

  resetPaymentFormValidated() {
    this.nameValidated = false;
    this.routingValidated = false;
    this.bankValidated = false;
    this.cardValidated = false;
    this.expMonthValidated = false;
    this.expYearValidated = false;
    this.cvcValidated = false;
  }

  validatePaymentForm(payment: Card | Check | Cash) {
    if (payment) switch (payment.type) {
      case 'card':
        this.validatePaymentCardForm(payment as Card);
        break;
      case 'check':
        this.validatePaymentCheckForm(payment as Check);
        break;
      case 'cash':
        this.validatePaymentCashForm(payment as Cash);
        break;
    }
  }

  validatePaymentCardForm(payment: Card) {
    this.validateName(payment.name);
    this.validateCard(payment.number ? payment.number.card : null);
    this.validateExpMonth(payment.number && payment.number.expiration ? payment.number.expiration.month : null);
    this.validateExpYear(payment.number && payment.number.expiration ? payment.number.expiration.year : null);
    this.validateCvc(payment.number ? payment.number.cvc : null);
  }

  validatePaymentCheckForm(payment: Check) {
    this.validateName(payment.name);
    this.validateRouting(payment.number ? payment.number.routing : null);
    this.validateBank(payment.number ? payment.number.bank : null);
  }

  validatePaymentCashForm(payment: Cash) {
  }

  onInputName(value: string, final = false) {
    if (final) {
      this.nameValidated = true;
    }
    this.validateName(value);
    if (this.nameValid) {
      this.paymentPartial.name = value;
    }
  }

  private validateName(name: string | null) {
    this.nameValid = name && name.length > 0 && name.length <= 240;
  }

  onInputRouting(value: string, final = false) {
    if (final) {
      this.routingValidated = true;
    }
    const number = Number(value);
    this.validateRouting(number);
    if (this.routingValid) {
      this.paymentPartial['number/routing'] = number;
    }
  }

  private validateRouting(routing: number | null) {
    this.routingValid = routing && routing > 0 && routing <= 999999999;
  }

  onInputBank(value: string, final = false) {
    if (final) {
      this.bankValidated = true;
    }
    const number = Number(value);
    this.validateBank(number);
    if (this.bankValid) {
      this.paymentPartial['number/bank'] = number;
    }
  }

  private validateBank(bank: number | null) {
    this.bankValid = bank && bank > 0 && bank <= 99999999999999999;
  }

  onInputCard(value: string, final = false) {
    if (final) {
      this.cardValidated = true;
    }
    this.validateCard(value);
    if (this.cardValid) {
      this.paymentPartial['number/card'] = value;
    }
  }

  private validateCard(card: string | null) {
    this.cardValid = card && this.cardRegex.test(card);
  }

  onInputExpMonth(value: string, final = false) {
    if (final) {
      this.expMonthValidated = true;
    }
    const number = Number(value);
    this.validateExpMonth(number);
    if (this.expMonthValid) {
      this.paymentPartial['number/expiration/month'] = number;
    }
  }

  private validateExpMonth(expMonth: number | null) {
    this.expMonthValid = expMonth && expMonth >= 1 && expMonth <= 12;
  }

  onInputExpYear(value: string, final = false) {
    if (final) {
      this.expYearValidated = true;
    }
    const number = Number(value);
    this.validateExpYear(number);
    if (this.expYearValid) {
      this.paymentPartial['number/expiration/year'] = number;
    }
  }

  private validateExpYear(expYear: number | null) {
    this.expYearValid = expYear && expYear >= 1 && expYear <= 99;
  }

  onInputCvc(value: string, final = false) {
    if (final) {
      this.cvcValidated = true;
    }
    const number = Number(value);
    this.validateCvc(number);
    if (this.cvcValid) {
      this.paymentPartial['number/cvc'] = number;
    }
  }

  private validateCvc(cvc: number | null) {
    this.cvcValid = cvc && cvc >= 100 && cvc <= 9999;
  }

  savePayment() {
    console.log('order payment update');
    console.log(this.paymentPartial);
    this.paymentRef.update(this.paymentPartial).catch(console.log);
    this.paymentPartial = {};
  }

  addNewPizza() {
    this.db.database.ref('/defaultPizza').once(
      'value',
      defaultPizza => {
        this.db.database.ref(this.orderRef).child('pizzas').transaction(pizzas => {
          if (pizzas) {
            pizzas.push(defaultPizza.val());
          } else {
            pizzas = [defaultPizza.val()];
          }
          return pizzas;
        }).catch(console.log);
      }).catch(console.log);
  }
}
