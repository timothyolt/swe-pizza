import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { routes } from './app.router';

import { ItemTypeComponent } from './item-type/item-type.component';
import { ItemCategoryComponent } from './item-category/item-category.component';
import { OrderComponent } from './order/order.component';
import { PizzaComponent } from './pizza/pizza.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { PastOrdersComponent } from './past-orders/past-orders.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ToppingsListComponent } from './toppings-list/toppings-list.component';
import { AccordionModule, ButtonsModule, TypeaheadModule } from 'ngx-bootstrap';
import { AccordionGroupListComponent } from './accordion-group-list/accordion-group-list.component';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemTypeComponent,
    ItemCategoryComponent,
    OrderComponent,
    PizzaComponent,
    PageNotFoundComponent,
    HomeComponent,
    LoginComponent,
    SignUpComponent,
    MyAccountComponent,
    PastOrdersComponent,
    AccountInfoComponent,
    AdminPanelComponent,
    ToppingsListComponent,
    AccordionGroupListComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AccordionModule.forRoot(),
    TypeaheadModule.forRoot(),
    ButtonsModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase, 'swe-pizza'), // imports firebase/app needed for everything
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    routes
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule {

}
