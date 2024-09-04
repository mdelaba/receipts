import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import { EnterEmailComponent } from "./enter-email/enter-email.component";
import { Router } from '@angular/router';

console.log('InvoicesComponent loaded');
@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [EnterEmailComponent],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent {
  enterEmail = signal(false);

  constructor(private apiService: ApiService, private router: Router) { }

  onPrint() {
    this.router.navigate(['/print']);
  }

  onEmail() {
    this.enterEmail.set(true);
  }

  onDownload() {
    this.apiService.getInvoice().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
