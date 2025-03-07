import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model'; // ✅ שימוש במודל הנכון
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user: User = {
    id: '',
    username: '', // ✅ שינוי מ- fullName ל- username
    email: '',
  };

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log('✅ UserComponent initialized');
  }

  /** Register a new user */
  registerUser(): void {
    if (!this.user.username || !this.user.email || !this.user.password) { // ✅ שינוי fullName ל- username
      this.showMessage('❌ All fields are required!', true);
      return;
    }

    this.userService.register(this.user).subscribe(
      (response) => {
        console.log('✅ User registered successfully:', response);
        this.showMessage('✅ Registration successful!', false);
        this.resetForm();
      },
      (error) => {
        console.error('❌ Error registering user:', error);
        this.showMessage('❌ Registration failed!', true);
      }
    );
  }

  /** Display success/error messages */
  private showMessage(message: string, isError: boolean): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? 'error-snackbar' : 'success-snackbar',
    });
  }

  /** Reset the form after submission */
  private resetForm(): void {
    this.user = { id: '', username: '', email: '', password: '' }; // ✅ עדכון username
  }
}
