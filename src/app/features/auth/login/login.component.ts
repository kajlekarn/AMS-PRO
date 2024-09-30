import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  floatingElements: { size: number, left: string, top: string, duration: string, delay: string }[] = [];
  loginError!: string;
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.createFloatingElements();
  }

  createFloatingElements() {
    const numElements = 20;
    for (let i = 0; i < numElements; i++) {
      this.floatingElements.push({
        size: Math.random() * 50 + 10,
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        duration: `${Math.random() * 10 + 5}s`,
        delay: `${Math.random() * 5}s`
      });
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(
        success => {
          this.isLoading = false;
          if (success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.loginError = 'Invalid username or password';
          }
        },
        error => {
          this.isLoading = false;
          this.loginError = 'An error occurred during login';
          console.error('Login error:', error);
        }
      );
    }
  }
}