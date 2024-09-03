import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { ApiService } from './api/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  message = '';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getHello().subscribe(response => {
      this.message = response;
    });
  }
}
