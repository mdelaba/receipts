import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-print',
  standalone: true,
  imports: [],
  templateUrl: './print.component.html',
  styleUrl: './print.component.css'
})
export class PrintComponent implements OnInit {
  pdfSrc: SafeResourceUrl | undefined;

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.apiService.getInvoice().subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }
}
