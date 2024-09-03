import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';
  private userId?: number;

  constructor(private http: HttpClient) { }

  getHello(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/hello`);
  }

  postLoginInfo(username: string, password: string): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/login`, { username: username, password: password }, { withCredentials: true, observe: 'response' }).pipe(
      map(response => this.userId = response.body as number));
  }

  getInvoice(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${this.userId}`, { withCredentials: true, responseType: 'blob' });
  }

  emailInvoice(email: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/email/${this.userId}`, { email }, { withCredentials: true });
  }
}