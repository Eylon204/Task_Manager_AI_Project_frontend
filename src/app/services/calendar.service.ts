import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private apiUrl = 'http://127.0.0.1:8000/calendar';

  constructor(private http: HttpClient) {}

  getCalendarItem(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }
}
