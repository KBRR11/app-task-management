import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../models/task.model';

@Pipe({
    name: 'filterTasks',
    standalone: false // Keeping as non-standalone for use in the shared module
})
export class FilterTasksPipe implements PipeTransform {
    transform(tasks: Task[], searchTerm: string = '', status: 'all' | 'completed' | 'pending' = 'all'): Task[] {
        if (!tasks || (!searchTerm && status === 'all')) {
            return tasks;
        }

        let filteredTasks = tasks;

        // Filter by status
        if (status === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.completed);
        } else if (status === 'pending') {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        }

        // Filter by search term
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filteredTasks = filteredTasks.filter(task =>
                task.title.toLowerCase().includes(term) ||
                task.description.toLowerCase().includes(term)
            );
        }

        return filteredTasks;
    }
}