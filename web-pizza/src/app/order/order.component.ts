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
import { Router } from '@angular/router';
import { Contact } from '../../models/contact';

/** Setup Angular component structure */
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
  /** RXJS Observable subscription */
  authSubscription: Subscription;
  /** RXJS Observable subscription */
  contactSubscription: Subscription;
  /** RXJS Observable subscription */
  addressSubscription: Subscription;
  /** RXJS Observable subscription */
  paymentSubscription: Subscription;
  /** RXJS Observable subscription */
  itemCatsSubscription: Subscription;
  /** Firebase reference for current order */
  activeOrderRef: Reference;
  /** Firebase reference for pizzas */
  pizzaRef: Reference;
  /** Is order accordian open */
  isOrderOpen = true;
  /** Is delivery accordian open */
  isDeliveryOpen = false;
  /** Is payment accordian open */
  isPaymentOpen = false;

  /** Firebase order reference */
  orderRef: string;
  /** Subscribable number */
  cost: Observable<number>;
  /** Subscribable number */
  total: Observable<number>;
  /** Array of Pizza objects */
  pizzas: Pizza[] = [];
  /** Observable list of item catagories */
  itemCats: Observable<SnapshotAction[]>;

  /** Is order set for delievery */
  isDelivery: Observable<boolean>;
  /** Firebase reference for user contact info */
  contactRef: AngularFireObject<Contact>;
  /** Subscribable contact object */
  contact: Observable<Contact>;
  /** Partial contact data */
  contactPartial: any = {};
  /** Firebase address reference */
  addressRef: AngularFireObject<Address>;
  /** Subscribable address object */
  address: Observable<Address>;
  /** Partial address data */
  addressPartial: any = {};
  /** Array of US states */
  states = ['NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI',
    'VA', 'WA', 'WV', 'WI', 'WY', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN',
    'MS', 'MO', 'MT', 'NE', 'NV', 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM'];
  /** US states regex */
  stateRegex = new RegExp(['^(NH)|(NJ)|(NM)|(NY)|(NC)(ND)|(MP)|(OH)|(OK)|(OR)|(PW)|(PA)|(PR)|(RI)|(SC)|(SD)|(TN)|(TX)|(UT)|(VT)|(VI)|(VA)|',
    '(WA)|(WV)|(WI)|(WY)|(FL)|(GA)|(GU)|(HI)|(ID)|(IL)|(IN)|(IA)|(KS)|(KY)|(LA)|(ME)|(MH)|(MD)|(MA)|(MI)|(MN)|(MS)|(MO)|(MT)|(NE)|(NV)|',
    '(AL)|(AK)|(AS)|(AZ)|(AR)|(CA)|(CO)|(CT)|(DE)|(DC)|(FM)$'].join(''));
  /** Is name validated */
  nameValidated = false;
  /** Is cell validated */
  cellValidated = false;
  /** Is address validated */
  addressValidated = false;
  /** Is apartment validated */
  apartmentValidated = false;
  /** Is city validated */
  cityValidated = false;
  /** Is state validated */
  stateValidated = false;
  /** Is zip validated */
  zipValidated = false;
  /** Is name valid */
  nameValid: boolean;
  /** Is cell valid */
  cellValid: boolean;
  /** Is address valid */
  addressValid: boolean;
  /** Is apartment valid */
  apartmentValid = true; // not required, starts valid to prevent having to touch input field
  /** Is city valid */
  cityValid: boolean;
  /** Is state valid */
  stateValid: boolean;
  /** Is state valid */
  zipValid: boolean;

  /** Payment type Firebase reference */
  paymentRef: AngularFireObject<Check | Card | Cash>;
  /** Subscribable payment object */
  payment: Observable<Check | Card | Cash>;
  /** Partial payment data */
  paymentPartial: any = {};
  /** Regex for credit card numbers */
  cardRegex = new RegExp('^([0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4})|([0-9]{16})$');
  /** Credit card expiration array */
  expMonths = [
    { value: '01', name: 'January' },
    { value: '02', name: 'February' },
    { value: '03', name: 'March' },
    { value: '04', name: 'April' },
    { value: '05', name: 'May' },
    { value: '06', name: 'June' },
    { value: '07', name: 'July' },
    { value: '08', name: 'August' },
    { value: '09', name: 'September' },
    { value: '10', name: 'October' },
    { value: '11', name: 'November' },
    { value: '12', name: 'December' }];
  /** Is card name validated */
  payNameValidated = false;
  /** Is routing number validated */
  routingValidated = false;
  /** Is bank number validated */
  bankValidated = false;
  /** Is card number validated */
  cardValidated = false;
  /** Is expiration month validated */
  expMonthValidated = false;
  /** Is expiration year validated */
  expYearValidated = false;
  /** Is credit card cvc validated */
  cvcValidated = false;
  /** Is card name valid */
  payNameValid: boolean;
  /** Is routing number valid */
  routingValid: boolean;
  /** Is bank number valid */
  bankValid: boolean;
  /** Is card number valid */
  cardValid: boolean;
  /** Is expiration month valid */
  expMonthValid: boolean;
  /** Is expiration year valid */
  expYearValid: boolean;
  /** Is credit card cvc valid */
  cvcValid: boolean;

  /** Initalize variables */
  constructor(private auth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) { }

  /** 
   * Get user info and subscribe to their data streams
   * 
   * Called when Angular is ready 
  */
  ngOnInit() {
    this.authSubscription = this.auth.authState.subscribe(user => {
      if (user) {
        console.log('using user for order: ' + user.uid);
        this.setupOrder(user.uid);
      } else {
        console.log('creating anonymous user for order');
        if (this.contactSubscription)
          this.contactSubscription.unsubscribe();
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

  /** unsubscribe to user data streams */
  ngOnDestroy() {
    if (this.authSubscription)
      this.authSubscription.unsubscribe();
    if (this.contactSubscription)
      this.contactSubscription.unsubscribe();
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

  /** Create new order assigned to the user */
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

  /** Set default values on new order creation */
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
    this.contactRef = this.db.object(this.orderRef + '/contact');
    this.addressRef = this.db.object(this.orderRef + '/address');
    this.contact = this.contactRef.valueChanges().shareReplay(1);
    if (this.contactSubscription)
      this.contactSubscription.unsubscribe();
    this.contactSubscription = this.contact.subscribe(contact => this.validateContactForm(contact));
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

  /** Save isDelivery to Firebase */
  saveIsDelivery(isDelivery: boolean) {
    console.log('order delivery update');
    console.log(isDelivery);
    this.db.database.ref(this.orderRef).update({ delivery: isDelivery }).catch(console.log);
  }

  /** Reset contact form validation */
  resetContactFormValidated() {
    this.nameValidated = false;
    this.cellValidated = false;
  }

  /** Check if contact form values are valid */
  validateContactForm(contact: Contact) {
    this.validateName(contact ? contact.name : null);
    this.validateCell(contact ? contact.cell : null);
  }

  /** Update validation on pizza name input event */
  onInputName(value: string, final = false) {
    if (final) {
      this.nameValidated = true;
    }
    this.validateName(value);
    if (this.nameValid) {
      this.contactPartial.name = value;
    }
  }

  /** Handle pizza name validation */
  private validateName(value: string | null) {
    this.nameValid = value && value.length > 0 && value.length <= 240;
  }

  /** Run cell number validation on input event */
  onInputCell(value: string, final = false) {
    if (final) {
      this.cellValidated = true;
    }
    this.validateCell(value);
    if (this.cellValid) {
      this.contactPartial.cell = value;
    }
  }

  /** Handle cell number validation */
  private validateCell(value: string | null) {
    this.cellValid = value && value.length > 0 && value.length <= 240;
  }

  /** Save contract info to Firebase */
  saveContact() {
    console.log('order contact update');
    console.log(this.contactPartial);
    this.contactRef.query.ref.update(this.contactPartial).catch(console.log);
    this.contactPartial = {};
  }

  /** Reset address form validation */
  resetAddressFormValidated() {
    this.addressValidated = false;
    this.apartmentValidated = false;
    this.cityValidated = false;
    this.stateValidated = false;
    this.zipValidated = false;
  }

  /** Validate address form fields */
  validateAddressForm(address: Address) {
    this.validateAddress(address ? address.line1 : null);
    this.validateApartment(address ? address.line2 : null);
    this.validateCity(address ? address.city : null);
    this.validateState(address ? address.state : null);
    this.validateZip(address ? address.zip : null);
  }

  /** Run address validation on input event */
  onInputAddress(value: string, final = false) {
    if (final) {
      this.addressValidated = true;
    }
    this.validateAddress(value);
    if (this.addressValid) {
      this.addressPartial.line1 = value;
    }
  }

  /** Handle address validation */
  private validateAddress(value: string | null) {
    this.addressValid = value && value.length > 0 && value.length <= 240;
  }

  /** Run apartment validation on input */
  onInputApartment(value: string, final = false) {
    if (final) {
      this.apartmentValidated = true;
    }
    this.validateApartment(value);
    if (this.apartmentValid) {
      this.addressPartial.line2 = value;
    }
  }

  /** Handle apartment validation */
  private validateApartment(value: string | null) {
    this.apartmentValid = value ? value.length <= 240 : true;
  }

  /** Run city validation on input */
  onInputCity(value: string, final = false) {
    if (final) {
      this.cityValidated = true;
    }
    this.validateCity(value);
    if (this.cityValid) {
      this.addressPartial.city = value;
    }
  }

  /** Handle city validation */
  private validateCity(value: string | null) {
    this.cityValid = value && value.length > 0 && value.length <= 240;
  }

  /** Run state validation on input */
  onInputState(value: string, final = false) {
    if (final) {
      this.stateValidated = true;
    }
    this.validateState(value);
    if (this.stateValid) {
      this.addressPartial.state = value;
    }
  }

  /** Handle state validation */
  private validateState(value: string | null) {
    this.stateValid = value && this.stateRegex.test(value);
  }

  /** Run zip code validation on input */
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

  /** Handle zip code validation */
  private validateZip(zip: number | null) {
    this.zipValid = zip && zip >= 0 && zip <= 99999;
  }

  /** Update address in Firebase */
  saveAddress() {
    console.log('order address update');
    console.log(this.addressPartial);
    this.addressRef.query.ref.update(this.addressPartial).catch(console.log);
    this.addressPartial = {};
  }

  /** Update payment type in Firebase */
  savePaymentType(paymentType: string) {
    console.log('order payment type update');
    console.log(paymentType);
    this.paymentRef.update({ type: paymentType }).catch(console.log);
  }

  /** Reset payment form validation */
  resetPaymentFormValidated() {
    this.payNameValidated = false;
    this.routingValidated = false;
    this.bankValidated = false;
    this.cardValidated = false;
    this.expMonthValidated = false;
    this.expYearValidated = false;
    this.cvcValidated = false;
  }

  /** Run payment form validation based on type */
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

  /** Validate credit card form */
  validatePaymentCardForm(payment: Card) {
    this.validatePayName(payment.name);
    this.validateCard(payment.number ? payment.number.card : null);
    this.validateExpMonth(payment.number && payment.number.expiration ? payment.number.expiration.month : null);
    this.validateExpYear(payment.number && payment.number.expiration ? payment.number.expiration.year : null);
    this.validateCvc(payment.number ? payment.number.cvc : null);
  }

  /** Validate check form */
  validatePaymentCheckForm(payment: Check) {
    this.validatePayName(payment.name);
    this.validateRouting(payment.number ? payment.number.routing : null);
    this.validateBank(payment.number ? payment.number.bank : null);
  }

  /** Validate cash form */
  validatePaymentCashForm(payment: Cash) {
  }

  /** Payment name input event validation */
  onInputPayName(value: string, final = false) {
    if (final) {
      this.payNameValidated = true;
    }
    this.validatePayName(value);
    if (this.payNameValid) {
      this.paymentPartial.name = value;
    }
  }

  /** Handle payment name validation */
  private validatePayName(name: string | null) {
    this.payNameValid = name && name.length > 0 && name.length <= 240;
  }

  /** Routing number input event validation */
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

  /** Handle routing number validation */
  private validateRouting(routing: number | null) {
    this.routingValid = routing && routing > 0 && routing <= 999999999;
  }

  /** Bank number input event validation */
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

  /** Handle bank number validation */
  private validateBank(bank: number | null) {
    this.bankValid = bank && bank > 0 && bank <= 99999999999999999;
  }

  /** Card number input event validation */
  onInputCard(value: string, final = false) {
    if (final) {
      this.cardValidated = true;
    }
    this.validateCard(value);
    if (this.cardValid) {
      this.paymentPartial['number/card'] = value;
    }
  }

  /** Handle card number validation */
  private validateCard(card: string | null) {
    this.cardValid = card && this.cardRegex.test(card);
  }

  /** Card expiration month input event validation */
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

  /** Handle card expiration month validation */
  private validateExpMonth(expMonth: number | null) {
    this.expMonthValid = expMonth && expMonth >= 1 && expMonth <= 12;
  }

  /** Card expiration year input event validation */
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

  /** Handle card expiration year validation */
  private validateExpYear(expYear: number | null) {
    this.expYearValid = expYear && expYear >= 1 && expYear <= 99;
  }

  /** Card CVC input event validation */
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

  /** Handle Card CVC validation */
  private validateCvc(cvc: number | null) {
    this.cvcValid = cvc && cvc >= 100 && cvc <= 9999;
  }

  /** Update payment info in Firebase */
  savePayment() {
    console.log('order payment update');
    console.log(this.paymentPartial);
    this.paymentRef.update(this.paymentPartial).catch(console.log);
    this.paymentPartial = {};
  }

  /** Add new pizza to active order */
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

  /** Update and finalize order on Firebase and show reciept */
  finishOrder() {
    if (this.orderRef && this.activeOrderRef) {
      const key = this.db.database.ref(this.orderRef).key;
      this.activeOrderRef.off();
      const update = {};
      update['activeOrder'] = null;
      update['orders/' + key] = true;
      this.db.database.ref('users/' + this.auth.auth.currentUser.uid).update(update).then(() => {
        return this.router.navigateByUrl('order/' + key);
      }).catch(console.log);
    }
  }
}
