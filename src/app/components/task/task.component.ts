import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // 📌 הוספת Snackbar

@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  tasks: any[] = [];
  isEditing: boolean = false;
  taskToEdit: any = null;

  constructor(private taskService: TaskService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(
      data => {
        this.tasks = data;
      },
      error => {
        this.showNotification('❌ Error loading tasks!', 'Close', 'error');
      }
    );
  }

  addTask() {
    const newTask = { title: 'New Task', description: 'This is a new task' };
    this.taskService.createTask(newTask).subscribe(
      () => {
        this.loadTasks();
        this.showNotification('✅ Task added successfully!', 'Close', 'success');
      },
      error => {
        this.showNotification('❌ Failed to add task!', 'Close', 'error');
      }
    );
  }

  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.showNotification('🗑️ Task deleted successfully!', 'Close', 'success');
      },
      error => {
        this.showNotification('❌ Failed to delete task!', 'Close', 'error');
      }
    );
  }

  editTask(task: any) {
    this.isEditing = true;
    this.taskToEdit = { ...task };
  }

  updateTask() {
    if (this.taskToEdit) {
      this.taskService.updateTask(this.taskToEdit.id, this.taskToEdit).subscribe(
        () => {
          this.isEditing = false;
          this.loadTasks();
          this.showNotification('✏️ Task updated successfully!', 'Close', 'success');
        },
        error => {
          this.showNotification('❌ Failed to update task!', 'Close', 'error');
        }
      );
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.taskToEdit = null;
  }

  showNotification(message: string, action: string, type: 'success' | 'error') {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }
}