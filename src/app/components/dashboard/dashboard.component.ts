import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('taskAnimation', [
      state('in', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-in')
      ]),
      transition('* => void', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  tasks: any[] = [];

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;
      },
      (error) => {
        console.error('❌ Error loading tasks:', error);
      }
    );
  }

  editTask(task: any): void {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '400px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(task.id, result).subscribe(
          (updatedTask) => {
            const index = this.tasks.findIndex(t => t.id === task.id);
            if (index !== -1) {
              this.tasks[index] = updatedTask;
            }
          },
          (error) => {
            console.error('❌ Error updating task:', error);
          }
        );
      }
    });
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        console.log(`✅ Task with ID ${taskId} deleted successfully.`);
      },
      (error) => {
        console.error('❌ Error deleting task:', error);
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}