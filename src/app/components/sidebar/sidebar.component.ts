import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isSidebarOpen = true;
  userEmail: string | null = '';
  isAuthenticated: boolean = false; // ✅ נוסיף את המשתנה כדי למנוע את השגיאה

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isAuthenticated = authStatus;
      this.userEmail = authStatus ? this.authService.getUserEmail() : null;
    });
  }

  toggleSidebar() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  closeSidebar() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}