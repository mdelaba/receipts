import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AzureApiService {

  constructor(private http: HttpClient) { }

  getFile(url: string, sasToken: string): Observable<Blob> {
    return this.http.get(url + '?' + sasToken, { responseType: 'blob' });
  }
}
