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
  loginForm: FormGroup | null = null;
  isLoading = false; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm!.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm!.value).subscribe(
        response => {
          localStorage.setItem('token', response.token);
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 }); // ✅ הודעת הצלחה
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.isLoading = false; 
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', { duration: 3000 }); // ✅ הודעת שגיאה
        }
      );
    }
  }
}