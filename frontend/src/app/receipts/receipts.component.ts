import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReceiptComponent } from "./receipt/receipt.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

console.log('ReceiptsComponent loaded');

@Component({
  selector: 'app-receipts',
  standalone: true,
  imports: [ReceiptComponent, CommonModule],
  templateUrl: './receipts.component.html',
  styleUrl: './receipts.component.css'
})
export class ReceiptsComponent implements OnInit {

  pdfSrc: SafeResourceUrl | undefined;
  numReceipts?: number;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.apiService.getNumReceipts().subscribe(response => {
      this.numReceipts = parseInt(response.toString());
    });
  }
  onButtonClick(btn: number) {
    const id = btn + 1;
    this.router.navigate(['/view-receipt', id]);
  }
}
