import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { Task } from './task.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    createTask(createTaskDto: CreateTaskDto) {
        const { title, description } = createTaskDto;

        const task: Task = {
            id: uuid.v1(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
        return task;
    }

    deleteTaskById(id: string): Task {
        const foundTask = this.tasks.find(task => task.id === id);
        this.tasks = this.tasks.filter(task => task != foundTask);
        return foundTask;
    }

    // updateTaskById(id: string, newStatus: TaskStatus) {
        
    // }
}
