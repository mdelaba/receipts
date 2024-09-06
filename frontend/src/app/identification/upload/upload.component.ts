import { Component, output } from '@angular/core';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {

  selectedFile: File | null = null;
  uploaded = output<boolean>();

  constructor(private apiService: ApiService) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile) {
      alert('no file selected');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.apiService.uploadIdentification(formData).subscribe(response => {
      if (response) {
        this.uploaded.emit(true);
      }
    });
  }
}
