import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone:false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false; // ✅ תיקון - הוספת משתנה טעינה

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.showSnackbar('❌ Please fill in all fields correctly', 'Close');
      return;
    }

    this.isLoading = true; // ✅ הפעלת מצב טעינה
    const registerData = this.registerForm.value;

    this.authService.register(registerData).subscribe(
      () => {
        this.isLoading = false; // ✅ סיום מצב טעינה
        this.showSnackbar('✅ Registration successful!', 'OK');
        this.router.navigate(['/login']);
      },
      (error) => {
        this.isLoading = false; // ✅ סיום מצב טעינה במקרה של שגיאה
        console.error('❌ Registration error:', error);
        this.showSnackbar('❌ Registration failed. Try again.', 'Close');
      }
    );
  }

  private showSnackbar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}