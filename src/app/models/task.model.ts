export interface Task {
  id?: string;  
  _id?: string; 
  title: string;
  description?: string;
  status: "pending" | "completed";
  priority: "low" | "medium" | "high";
  due_date?: string | null;
  user_id: string;
  estimated_time?: number;
  scheduled_time?: string | null;
  completed: boolean;
}