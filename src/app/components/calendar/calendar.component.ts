import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEvent } from '../../models/calendar-event.model';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  events: CalendarEvent[] = [];
  selectedDate: Date = new Date();

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.loadEvents();
  }

  /** get all events */
  loadEvents() {
    this.calendarService.getEvents().subscribe((data: CalendarEvent[]) => {
      this.events = data.map(event => ({
        ...event,
        date: new Date(event.date) // ✅ המרה מ- string ל- Date
      }));
    });
  }

  /** add new event */
  addNewEvent() {
    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(), 
      title: 'New Event',
      date: this.selectedDate,
      description: 'Auto-generated event',
      location: 'Online',
      user_id: 'user123'
    };
  
    this.calendarService.addEvent(newEvent).subscribe((event: CalendarEvent) => {
      this.events.push({
        ...event,
        date: new Date(event.date) 
      });
    });
  }

  /** delete event by id */
  deleteEvent(eventId: string) {
    this.calendarService.deleteEvent(eventId).subscribe(() => {
      this.events = this.events.filter(event => event.id !== eventId);
    });
  }
}