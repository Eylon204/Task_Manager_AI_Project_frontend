import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  /** מביא את כל המשימות */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      map(tasks => tasks.map(task => ({
        ...task,
        due_date: task.due_date ? new Date(task.due_date).toISOString() : null
      })))
    );
  }

  /** יוצר משימה חדשה */
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  /** מעדכן משימה */
  updateTask(taskId: string, task: Partial<Task>): Observable<Task> {
    if (!taskId) {
      console.error('❌ updateTask was called with an undefined taskId!');
      return throwError(() => new Error('Task ID is required'));
    }
  
    return this.http.put<Task>(`${this.apiUrl}/${taskId}`, task);
  }

  /** מוחק משימה */
  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }
}