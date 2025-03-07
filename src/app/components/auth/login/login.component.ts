import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // ✅ ווידוא שזה email
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    console.log("🔎 Form Status:", this.loginForm.status);  // האם הטופס תקין?
    console.log("📡 Form Data:", this.loginForm.value); // מה הנתונים שנשלחים?
    console.log("🟢 Is button active?", !this.loginForm.invalid); // האם הכפתור פעיל?

    if (this.loginForm.invalid) {
      this.showSnackbar('❌ Please fill in all fields correctly', 'Close');
      return;
    }

    this.isLoading = true;
    const loginData = {
      username: this.loginForm.value.email,  // ✅ שינוי ל-email (כי ה-API מחפש email)
      password: this.loginForm.value.password
    };

    console.log('📡 Sending login request:', loginData); // Debugging

    this.authService.login(loginData).subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log('✅ Login Response:', response);
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          this.showSnackbar('✅ Login successful!', 'OK');
          this.router.navigate(['/dashboard']);
        } else {
          this.showSnackbar('❌ Invalid login response', 'Close');
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('❌ Login Error:', error);

        let errorMessage = '❌ Login failed. Please try again.';
        switch (error.status) {
          case 400:
            errorMessage = '❌ Bad request. Check your details.';
            break;
          case 401:
            errorMessage = '❌ Incorrect email or password.';
            break;
          case 403:
            errorMessage = '❌ Access denied. Contact support.';
            break;
          case 500:
            errorMessage = '❌ Server error. Please try again later.';
            break;
        }
        this.showSnackbar(errorMessage, 'Close');
      }
    );
  }

  private showSnackbar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}