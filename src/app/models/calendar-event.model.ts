export interface CalendarEvent {
  id?: string;  
  title: string;
  date: Date;
  description?: string;
  location?: string;
  user_id?: string;
}