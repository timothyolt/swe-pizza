import { Component, OnInit} from '@angular/core';
import { Order } from '../../models/order';
import { Pizza } from '../../models/pizza';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Address } from '../../models/address';
import { Card } from '../../models/card';
import { Check } from '../../models/check';
import { Cash } from '../../models/cash';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
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
  stateRegex = new RegExp('^(NH)|(NJ)|(NM)|(NY)|(NC)(ND)|(MP)|(OH)|(OK)|(OR)|(PW)|(PA)|(PR)|(RI)|(SC)|(SD)|(TN)|(TX)|(UT)|(VT)|(VI)|(VA)|(WA)|(WV)|(WI)|(WY)|(FL)|(GA)|(GU)|(HI)|(ID)|(IL)|(IN)|(IA)|(KS)|(KY)|(LA)|(ME)|(MH)|(MD)|(MA)|(MI)|(MN)|(MS)|(MO)|(MT)|(NE)|(NV)|(AL)|(AK)|(AS)|(AZ)|(AR)|(CA)|(CO)|(CT)|(DE)|(DC)|(FM)$');
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

  constructor(private auth: AngularFireAuth, private db: AngularFireDatabase) {
    this.auth.authState.subscribe(user => {
      if (user) {
        console.log('using user for order: ' + user.uid);
        this.setupOrder(user.uid);
      } else {
        console.log('creating anonymous user for order');
        this.auth.auth.signInAnonymously().catch(console.log);
      }
    });
  }

  private setupOrder(userId: string) {
    this.db.database.ref('/users/' + userId).once('value', user => {
      if (user.exists() && user.val().activeOrder) {
        this.orderRef = '/orders/' + user.val().activeOrder;
      } else {
        const order: Partial<Order> = {
          createdAtDate: new Date(),
          user: userId,
          delivery: true
        };
        const orderId = this.db.database.ref('/orders').push(order).key;
        this.db.database.ref('/users/' + userId).update({activeOrder: orderId}).catch(console.log);
        this.orderRef = '/orders/' + orderId;
        this.addNewPizza();
      }
      this.cost = this.db.object(this.orderRef + '/cost').valueChanges().share();
      this.total = this.db.object(this.orderRef + '/total').valueChanges().share();
      this.isDelivery = this.db.object(this.orderRef + '/delivery').valueChanges().share();
      this.addressRef = this.db.object(this.orderRef + '/address');
      this.address = this.addressRef.valueChanges().share();
      this.address.subscribe(address => this.validateAddressForm(address));
      this.paymentRef = this.db.object(this.orderRef + '/payment');
      this.payment = this.paymentRef.valueChanges().share();
      this.db.database.ref(this.orderRef + '/pizzas').on('child_added', pizza => {
        if (!this.pizzas) {
          this.pizzas = [];
        }
        const pizzaVal = pizza.val();
        pizzaVal['$key'] = pizza.key;
        this.pizzas.splice(Number(pizza.key), 0, pizzaVal);
      });
      this.db.database.ref(this.orderRef + '/pizzas').on('child_removed', pizza => {
        this.pizzas.splice(Number(pizza.key), 1);
      });
    }).catch(console.log);
    this.itemCats = this.db.list('/itemCat').snapshotChanges().share();
    this.itemCats.subscribe(console.log);
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
    this.validateAddress(address.line1);
    this.validateApartment(address.line2);
    this.validateCity(address.city);
    this.validateState(address.state);
    this.validateZip(address.zip);
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

  private validateAddress(value: string) {
    this.addressValid = value.length > 0 && value.length <= 240;
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

  private validateApartment(value: string) {
    this.apartmentValid = value.length <= 240;
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

  private validateCity(value: string) {
    this.cityValid = value.length > 0 && value.length <= 240;
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

  private validateState(value: string) {
    this.stateValid = this.stateRegex.test(value);
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

  private validateZip(zip: number) {
    this.zipValid = zip >= 0 && zip <= 99999;
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

  savePayment() {
    console.log('order payment update');
    console.log(this.paymentPartial);
    this.paymentRef.update(this.paymentPartial).catch(console.log);
    this.paymentPartial = {};
  }

  ngOnInit() {
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
