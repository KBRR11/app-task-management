import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    constructor(private http: HttpClient) { }

    getTasks(): Observable<{ tasks: Task[] }> {
        return this.http.get<{ tasks: Task[] }>(`${environment.apiUrl}/tasks/user`);
    }

    getTaskById(id: string): Observable<{ task: Task }> {
        return this.http.get<{ task: Task }>(`${environment.apiUrl}/tasks/${id}`);
    }

    createTask(task: Partial<Task>): Observable<{ task: Task }> {
        return this.http.post<{ task: Task }>(`${environment.apiUrl}/tasks`, task);
    }

    updateTask(id: string, task: Partial<Task>): Observable<{ task: Task }> {
        return this.http.put<{ task: Task }>(`${environment.apiUrl}/tasks/${id}`, task);
    }

    toggleTaskCompletion(id: string): Observable<{ task: Task }> {
        return this.http.patch<{ task: Task }>(`${environment.apiUrl}/tasks/${id}/toggle-completion`, {});
    }

    deleteTask(id: string): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/tasks/${id}`);
    }
}