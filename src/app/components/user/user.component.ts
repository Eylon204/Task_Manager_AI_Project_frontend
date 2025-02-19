import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  constructor(private userService: UserService){}

  registerUser(){
    const userData = { username: 'testuser', email: 'test@exmaple.com', password: '123456'};
    this.userService.register(userData).subscribe(response =>{
      console.log('User registered:', response);
    })
    }
  }
