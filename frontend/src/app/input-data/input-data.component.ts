import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { InputReceipt } from '../invoices/invoice/input-receipt.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input-data',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-data.component.html',
  styleUrl: './input-data.component.css'
})
export class InputDataComponent {
  form = new FormGroup({
    date: new FormControl('', {
      validators: [Validators.required]
    }),
    customerName: new FormControl('', {
      validators: [Validators.required]
    }),
    paymentMethod: new FormControl<'Credit Card' | 'Debit Card' | 'Cash' | 'Paypal'>('Credit Card', {
      validators: [Validators.required]
    }),
    amount: new FormControl('', {
      validators: [Validators.required]
    }),
    address: new FormControl('', {
      validators: [Validators.required]
    }),
  });

  constructor(private apiService: ApiService, private router: Router) { }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.apiService.postReceipt(this.form.value as InputReceipt).subscribe({
      error: (err) => {
        console.error(err);
      }
    });
    this.router.navigate(['/options']);
  }
}
