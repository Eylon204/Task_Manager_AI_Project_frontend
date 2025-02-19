import { Component } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  events: any[] = []

  constructor(private calendarService: CalendarService){}

  ngOnInit() {
    this.loadCalendarItems();
  }

  loadCalendarItems() {
    this.calendarService.getCalendarItem().subscribe(data => {
      this.events = data;
    });
  }
}
