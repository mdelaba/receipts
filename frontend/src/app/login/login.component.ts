import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

let initialEmailValue = '';
const savedForm = window.localStorage.getItem('saved-login-form');

if (savedForm) {
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

console.log('LoginComponent loaded');
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  loginInvalid = signal(false);
  formInvalid = signal(false);
  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    })
  });

  constructor(private apiService: ApiService, private router: Router) { }

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  ngOnInit() {
    const subscription = this.form.valueChanges.pipe(
      debounceTime(500)
    ).subscribe({
      next: value => {
        window.localStorage.setItem('saved-login-form', JSON.stringify({ email: value.email }));
      }
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit() {
    if (this.form.valid) {
      const enteredEmail = this.form.value.email;
      const enteredPassword = this.form.value.password;
      this.apiService.postLoginInfo(enteredEmail as string, enteredPassword as string).subscribe({
        next: (response) => {
          if (response) {
            console.log('Logged in, redirecting to /input');
            this.router.navigate(['/options'])
          }
          else {
            console.log('Login invalid.');
          }
        },
        error: (error) => {
          console.log('error');
          this.loginInvalid.set(true);
        }
      });

    }
    else {
      this.formInvalid.set(true);
      console.log("Form Invalid");
    }
  }
}
