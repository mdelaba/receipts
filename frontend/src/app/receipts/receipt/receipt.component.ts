import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../../api/api.service';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, RouterLink, RouterLinkActive, RouterStateSnapshot } from '@angular/router';

console.log('ReceiptComponent loaded');
@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css'
})
export class ReceiptComponent implements OnInit {
  id: string | undefined;
  pdfSrc: SafeResourceUrl | undefined;

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe(url => {
      this.id = url.map(segment => segment.path)[1];
      console.log(this.id);
      if (this.id) {
        this.apiService.getReceipt(this.id).subscribe(response => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        });
      }
    });
  }
}
export const resolveId: ResolveFn<string> = (activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) => {
  const id = activatedRoute.paramMap.get('id') || '';

  return id;
};
