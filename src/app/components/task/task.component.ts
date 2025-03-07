import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  currentUser: User | null = null;

  newTask: Task = {
    id: '',
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    user_id: '',
    completed: false,
  };

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  /** אתחול הרכיב */
  ngOnInit(): void {
    console.log("🟢 Initializing TaskComponent...");
    const user = this.authService.getCurrentUser();

    if (!user) {
      console.error("❌ User not authenticated");
      this.showSnackbar("User not authenticated", "error-snackbar");
      return;
    }

    this.currentUser = user;
    console.log("✅ User authenticated:", this.currentUser);

    this.loadTasks();
  }

  /** מחיקת מטמון משימות מה-Local Storage */
  clearLocalTasks(): void {
    console.log("🗑 Clearing local storage tasks...");
    localStorage.removeItem('tasks_cache');
  }

  /** טעינת משימות מהשרת */
/** טעינת משימות מהשרת */
loadTasks(): void {
  console.log("📡 Fetching tasks from server...");

  this.taskService.getTasks().subscribe(
    (tasks: Task[]) => {
      console.log("📡 Raw tasks from server:", tasks);

      this.tasks = tasks.map(task => ({
        ...task,
        id: (task as any)._id ? (task as any)._id : task.id,
        completed: task.status === "completed"
      }));

      console.log("✅ Tasks after processing:", this.tasks);
    },
    (error) => {
      console.error("❌ Error loading tasks:", error);
      this.showSnackbar("Error loading tasks", "error-snackbar");
    }
  );
}

  /** הוספת משימה חדשה */
  addTask(): void {
    console.log("➕ Adding new task...", this.newTask);
    
    if (!this.currentUser?.id) {
      console.error("❌ User ID is missing!");
      this.showSnackbar("User ID is missing!", "error-snackbar");
      return;
    }

    const newTask: Task = {
      id: '',
      title: this.newTask.title.trim(),
      description: this.newTask.description?.trim() || '',
      priority: this.newTask.priority || 'medium',
      due_date: this.newTask.due_date || null,
      user_id: this.currentUser.id,
      status: 'pending',
      completed: false,
    };

    console.log("📤 Sending new task to server:", newTask);

    this.taskService.createTask(newTask).subscribe(
      (response) => {
        console.log("✅ Task added successfully:", response);
        this.tasks.push(response);
        this.resetTaskForm();
        this.showSnackbar("Task added successfully", "success-snackbar");
      },
      (error) => {
        console.error("❌ Error adding task:", error);
        this.showSnackbar("Error adding task", "error-snackbar");
      }
    );
  }

  /** מחיקת משימה */
  deleteTask(taskId: string): void {
    console.log("🗑 Deleting task with ID:", taskId);
  
    if (!taskId || taskId === "MISSING") {
      console.error("❌ Invalid Task ID:", taskId);
      return;
    }
  
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        console.log(`✅ Task ${taskId} deleted successfully`);
        this.tasks = this.tasks.filter(task => task.id !== taskId && task._id !== taskId);
        this.showSnackbar("Task deleted successfully", "success-snackbar");
      },
      (error) => {
        console.error("❌ Error deleting task:", error);
        this.showSnackbar("Error deleting task", "error-snackbar");
      }
    );
  }

  /** השלמת משימה */
  toggleTaskCompletion(task: Task): void {
    console.log("🔄 Toggling task completion:", task);
  
    if (!task.id && !(task as any)._id) {
      console.error("❌ Invalid Task ID:", task.id);
      this.showSnackbar("Error: Invalid Task ID", "error-snackbar");
      return;
    }
  
    const updatedTask: Partial<Task> = {
      ...task,
      id: task.id || (task as any)._id, // שימוש נכון ב-ID
      status: task.status === "completed" ? "pending" : "completed",
    };
  
    console.log("📤 Updating task status on server:", updatedTask);
  
    this.taskService.updateTask(updatedTask.id!, updatedTask).subscribe(
      (updated: Task) => {
        console.log("✅ Task updated:", updated);
        const index = this.tasks.findIndex((t) => t.id === updated.id);
        if (index !== -1) {
          this.tasks[index] = updated;
        }
        this.showSnackbar("Task updated", "success-snackbar");
      },
      (error) => {
        console.error("❌ Error updating task:", error);
        this.showSnackbar("Error updating task", "error-snackbar");
      }
    );
  }
  
  /** עריכת משימה */
  editTask(taskId: string): void {
    console.log("✏️ Editing task with ID:", taskId);

    if (!taskId || taskId === "MISSING") {
      console.error("❌ Invalid Task ID:", taskId);
      this.showSnackbar("Error: Invalid Task ID", "error-snackbar");
      return;
    }

    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      console.error("❌ Task not found!");
      this.showSnackbar("Error: Task not found", "error-snackbar");
      return;
    }

    const updatedTitle = prompt("Edit Task Title:", task.title);
    if (updatedTitle !== null && updatedTitle.trim() !== "") {
      const updatedTask: Partial<Task> = { title: updatedTitle.trim() };

      console.log("📤 Sending updated task to server:", updatedTask);

      this.taskService.updateTask(taskId, updatedTask).subscribe(
        (updated: Task) => {
          console.log("✅ Task updated successfully:", updated);
          const index = this.tasks.findIndex(t => t.id === updated.id);
          if (index !== -1) {
            this.tasks[index] = updated;
          }
          this.showSnackbar("Task updated successfully", "success-snackbar");
        },
        (error) => {
          console.error("❌ Error updating task:", error);
          this.showSnackbar("Error updating task", "error-snackbar");
        }
      );
    }
  }

  /** פונקציה למעקב אחר מזהה משימה */
  trackByTaskId(index: number, task: Task): string {
    return task.id || `temp_${index}`;
  }

  /** הצגת הודעה */
  private showSnackbar(message: string, panelClass: string): void {
    console.log("🔔 Snackbar message:", message);
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass });
  }

  /** איפוס טופס המשימות */
  private resetTaskForm(): void {
    console.log("🆕 Resetting task form...");
    this.newTask = {
      id: '',
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      user_id: '',
      completed: false,
    };
  }
}