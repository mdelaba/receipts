import { Component } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enter-email',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './enter-email.component.html',
  styleUrl: './enter-email.component.css'
})
export class EnterEmailComponent {
  email = '';
  emailSent = false;

  constructor(private apiService: ApiService) { }

  onSend() {
    this.apiService.emailInvoice(this.email, '1').subscribe({
      next: (response) => {
        console.log(response);
      }
    });
    this.emailSent = true;
  }
}
