import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CalendarEvent } from '../models/calendar-event.model'; // ✅ ייבוא נכון של מודל אירועים
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = `${environment.apiUrl}/calendar/events`;

  constructor(private http: HttpClient) {}

  /** Get all events */
  getEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>('API_URL/events').pipe(
      map(events => events.map(event => ({
        ...event,
        date: new Date(event.date) // ✅ המרה מ-ISO ל-Date
      })))
    );
  }

  /** Add a new event */
  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(this.apiUrl, event);
  }

  /** Delete an event by ID */
  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}`);
  }
}