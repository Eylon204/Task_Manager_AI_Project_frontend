import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://127.0.0.1:8000/tasks';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  createTask(taskData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, taskData);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`);
  }

  updateTask(taskId: string, taskData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${taskId}`, taskData);
  }
}