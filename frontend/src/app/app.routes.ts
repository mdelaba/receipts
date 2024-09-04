import { Routes } from '@angular/router';
import { resolveId } from './receipts/receipt/receipt.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(mod => mod.LoginComponent), //lazy loading - only import component when we navigate to this route
        title: 'Login',
    },
    {
        path: 'options',
        loadComponent: () => import('./options/options.component').then(mod => mod.OptionsComponent), //lazy loading - only import component when we navigate to this route
        title: 'Options',
    },
    {
        path: 'input',
        loadComponent: () => import('./input-data/input-data.component').then(mod => mod.InputDataComponent), //lazy loading - only import component when we navigate to this route
        title: 'Input Receipt Data',
    },
    {
        path: 'receipts',
        loadComponent: () => import('./receipts/receipts.component').then(mod => mod.ReceiptsComponent), //lazy loading - only import component when we navigate to this route
        title: 'Receipts'
    },
    {
        path: 'view-receipt/:id',
        loadComponent: () => import('./receipts/receipt/receipt.component').then(mod => mod.ReceiptComponent), //lazy loading - only import component when we navigate to this route
        runGuardsAndResolvers: 'paramsOrQueryParamsChange', //allow resolve data to change every time query parameters change
        resolve: {
            id: resolveId,
        },
        title: 'View Receipt',
    },
    {
        path: '**',
        redirectTo: '',
    }
];