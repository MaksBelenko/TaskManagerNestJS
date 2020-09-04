import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { stat } from 'fs';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './enums/task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getTasks(
        getTaskFilterDto: GetTaskFilterDto,
        user: User
    ): Promise<Task[]> {
        return this.taskRepository.getTasks(getTaskFilterDto, user);
    }


    /**
     * Fetches single task by id
     * @param id ID used to find task in database
     */
    async getTaskById(
        id: number,
        user: User
    ): Promise<Task> {
        return await this.taskRepository.getTaskById(id, user);
    }

    /**
     * Creates new task from dto
     * @param createTaskDto DTO used to pass the data
     */
    async createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    /**
     * Deletes task if found by ID
     * @param id Used to find the task
     */
    async deleteTaskById(
        id: number,
        user:  User
    ): Promise<Task> {
        return this.taskRepository.deleteTask(id, user);
    }

    /**
     * Updates task found by ID with information from DTO
     * @param id Generated id
     * @param updateTaskDto DTO that has task update info
     */
    async updateTaskById(
        id: number, 
        status: TaskStatus,
        user: User
    ): Promise<Task> {
        const task = await this.getTaskById(id, user);

        task.status = status;
        await task.save();

        return task;
        // task.status = status;
        // return task;
    }
}
