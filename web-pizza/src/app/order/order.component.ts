import { Component, OnInit} from '@angular/core';
import { Order } from '../../models/order';
import { Pizza } from '../../models/pizza';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Address } from '../../models/address';

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
  apartmentValid: boolean;
  cityValid: boolean;
  stateValid: boolean;
  zipValid: boolean;

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
      this.cost = this.db.object(this.orderRef + '/cost').valueChanges();
      this.total = this.db.object(this.orderRef + '/total').valueChanges();
      this.isDelivery = this.db.object(this.orderRef + '/delivery').valueChanges();
      this.addressRef = this.db.object(this.orderRef + '/address');
      this.address = this.addressRef.valueChanges();
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
    this.itemCats = this.db.list('/itemCat').snapshotChanges();
    this.itemCats.subscribe(console.log);
  }

  saveIsDelivery(isDelivery: boolean) {
    console.log('order delivery update');
    console.log(isDelivery);
    this.db.database.ref(this.orderRef).update({delivery: isDelivery}).catch(console.log);
  }

  resetAddressValidated() {
    this.addressValidated = false;
    this.apartmentValidated = false;
    this.cityValidated = false;
    this.stateValidated = false;
    this.zipValidated = false;
  }

  onInputAddress(value: string, final = false) {
    if (final) {
      this.addressValidated = true;
    }
    this.addressValid = value.length > 0 && value.length <= 240;
    if (this.addressValid) {
      this.addressPartial.line1 = value;
    }
  }

  onInputApartment(value: string, final = false) {
    if (final) {
      this.apartmentValidated = true;
    }
    this.apartmentValid = value.length <= 240;
    if (this.apartmentValid) {
      this.addressPartial.line2 = value;
    }
  }

  onInputCity(value: string, final = false) {
    if (final) {
      this.cityValidated = true;
    }
    this.cityValid = value.length > 0 && value.length <= 240;
    if (this.cityValid) {
      this.addressPartial.city = value;
    }
  }

  onInputState(value: string, final = false) {
    if (final) {
      this.stateValidated = true;
    }
    this.stateValid = this.stateRegex.test(value);
    if (this.stateValid) {
      this.addressPartial.state = value;
    }
  }

  onInputZip(value: string, final = false) {
    if (final) {
      this.zipValidated = true;
    }
    const zip = Number(value);
    this.zipValid = zip >= 0 && zip <= 99999;
    if (this.zipValid) {
      this.addressPartial.zip = zip;
    }
  }

  saveAddress() {
    console.log('order address update');
    console.log(this.addressPartial);
    this.addressRef.query.ref.update(this.addressPartial).catch(console.log);
    this.addressPartial = {};
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
