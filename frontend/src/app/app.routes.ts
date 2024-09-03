import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { PrintComponent } from './invoices/print/print.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
    },
    {
        path: 'invoice',
        component: InvoicesComponent,
        title: 'Invoice'
    },
    {
        path: 'print',
        component: PrintComponent,
        title: 'Print'
    },
    {
        path: '**',
        redirectTo: '',
    }
];