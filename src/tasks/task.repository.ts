import { Repository, EntityRepository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './enums/task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    /**
     * Gets all tasks with/without filters
     * @param getTaskFilterDto DTO used for filters that are put in
     */
    async getTasks(
        getTaskFilterDto: GetTaskFilterDto,
        user: User
    ): Promise<Task[]> {
        const { search, status } = getTaskFilterDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status })
        }

        if (search) {
            // %% is for partial search
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` })
        }

        const tasks = await query.getMany();
        
        return tasks;
    }

    /**
     * Fetches task by id for user from the database
     * @param id ID of the task
     * @param user User object
     */
    async getTaskById(
        id: number,
        user: User
    ): Promise<Task> {
        const foundTask = await this.findOne({ where: { id, userId: user.id } });

        if (!foundTask) {
            throw new NotFoundException(`Task with id ${id} is not found`);
        }

        return foundTask;
    }


    /**
     * Creates new task in the database
     * @param createTaskDto DTO that contains the information with which the entry is created
     */
    async createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();

        // removes user from task (not to expose
        // password and salt when sending a response)
        delete task.user; 

        return task;
    }


    /**
     * Deletes the task with the provided ID
     * @param id ID of the task to be deleted
     */
    async deleteTask(
        id: number,
        user: User
    ): Promise<Task> {
        let taskToRemove = await this.getTaskById(id, user); 
        
        let removedTask = await this.remove(taskToRemove);
        return removedTask;
    }
}
