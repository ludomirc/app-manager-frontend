import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Task} from '../models/task';
import {TaskStatusChange} from '../models/task-status-change';
import {ConfigService} from './config.service';

@Injectable({providedIn: 'root'})
export class TaskService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
  }

  private get baseUrl(): string {
    return this.configService.apiUrl;
  }

  getTasksByApplicationId(applicationId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/applications/${applicationId}/tasks`);
  }

  getTask(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${taskId}`);
  }

  getStatusChanges(taskId: number): Observable<TaskStatusChange[]> {
    return this.http.get<TaskStatusChange[]>(`${this.baseUrl}/task-status-changes/task/${taskId}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks`, task);
  }

  recordStatusChange(taskStatusChange: TaskStatusChange): Observable<TaskStatusChange> {
    const taskId = taskStatusChange.taskId;
    return this.http.post<TaskStatusChange>(`${this.baseUrl}/task-status-changes/task/${taskId}/status`, taskStatusChange);
  }
}
