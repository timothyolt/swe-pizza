import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { OrderComponent } from './order/order.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { LogoutComponent } from './logout/logout.component';
import { EditToppingComponent } from './edit-topping/edit-topping.component';
import { CreateToppingComponent } from './create-topping/create-topping.component';
import { EditToppingCatComponent } from './edit-topping-cat/edit-topping-cat.component';
import { CreateToppingCatComponent } from './create-topping-cat/create-topping-cat.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReceiptComponent } from './receipt/receipt.component';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'signUp', component: SignUpComponent },
    { path: 'order', component: OrderComponent },
    { path: 'account', component: MyAccountComponent },
    { path: 'admin', component: AdminPanelComponent },
    { path: 'admin/toppings/:id/edit', component: EditToppingComponent },
    { path: 'admin/toppings/new', component: CreateToppingComponent },
    { path: 'admin/topping-catagory/:id/edit', component: EditToppingCatComponent },
    { path: 'admin/topping-catagory/new', component: CreateToppingCatComponent },
    { path: 'order/:id', component: ReceiptComponent },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    { path: '**', component: PageNotFoundComponent }
];

/** Export Router module */
export const routes: ModuleWithProviders = RouterModule.forRoot(appRoutes);
