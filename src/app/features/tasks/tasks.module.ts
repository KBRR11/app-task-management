import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';

const routes: Routes = [
    { path: '', component: TaskListComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        TaskListComponent,
        TaskFormComponent
    ]
})
export class TasksModule { }