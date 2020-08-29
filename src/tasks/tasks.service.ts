import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { Task } from './task.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { stat } from 'fs';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    /**
     * Fetches all tasks without filters
     */
    getAllTasks(): Task[] {
        return this.tasks;
    }

    /**
     * Fetches tasks filtered by supplied DTO params
     * @param filterDto DTO filter which is created from request params
     */
    getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(
                task =>
                    task.title.includes(search) ||
                    task.description.includes(search),
            );
        }

        return tasks;
    }

    /**
     * Fetches single task by id
     * @param id ID used to find task in database
     */
    getTaskById(id: string): Task {
        const foundTask = this.tasks.find(task => task.id === id);

        if (!foundTask) {
            throw new NotFoundException(`Task with id ${id} is not found`);
        }

        return foundTask;
    }

    /**
     * Creates new task from dto
     * @param createTaskDto DTO used to pass the data
     */
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

    /**
     * Deletes task if found by ID
     * @param id Used to find the task
     */
    deleteTaskById(id: string): Task {
        const foundTask = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task != foundTask);
        return foundTask;
    }

    /**
     * Updates task found by ID with information from DTO
     * @param id Generated id
     * @param updateTaskDto DTO that has task update info
     */
    updateTaskById(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
