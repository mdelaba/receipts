import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { AzureApiService } from '../api/azure-api.service';
import { UploadComponent } from "./upload/upload.component";

@Component({
  selector: 'app-identification',
  standalone: true,
  imports: [UploadComponent],
  templateUrl: './identification.component.html',
  styleUrl: './identification.component.css'
})
export class IdentificationComponent implements OnInit {
  dataSrc: SafeResourceUrl | undefined;
  type: string | undefined;

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer, private azureApiService: AzureApiService) { }

  ngOnInit() {

  }

  onUpload(uploaded: boolean) {
    if (uploaded) {
      this.apiService.getIdentification().subscribe(response => {
        const url = response.url;
        const sasToken = response.sasToken;
        this.azureApiService.getFile(url, sasToken).subscribe(response => {
          console.log(response);
          console.log(response.type);
          const fileType = response.type;
          if (fileType === 'application/pdf') {
            this.type = 'pdf';
          } else {
            this.type = 'image';
          }
          console.log(this.type);
          const blob = new Blob([response], { type: fileType });
          const url = window.URL.createObjectURL(blob);
          this.dataSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        });
      });
    }
  }
}
