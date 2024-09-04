import { Component } from '@angular/core';
import { Router } from '@angular/router';

console.log('OptionsComponent loaded');
@Component({
  selector: 'app-options',
  standalone: true,
  imports: [],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {

  constructor(private router: Router) { }

  onInputReceipt() {
    this.router.navigate(['/input']);
  }
  onViewReceipts() {
    this.router.navigate(['/receipts']);
  }
}
