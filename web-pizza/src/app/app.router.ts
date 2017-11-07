import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { OrderComponent } from './order/order.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignUpComponent },
    { path: 'order', component: OrderComponent },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    { path: '**', component: PageNotFoundComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(appRoutes);