import { Repository, EntityRepository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './enums/task-status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTasks(getTaskFilterDto: GetTaskFilterDto): Promise<Task[]> {
        const { search, status } = getTaskFilterDto;

        const query = this.createQueryBuilder('task');

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
     * Creates new task in the database
     * @param createTaskDto DTO that contains the information with which the entry is created
     */
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();

        return task;
    }


    async deleteTask(id: number): Promise<Task> {
        let taskToRemove = await this.findOne(id);

        if (!taskToRemove) {
            throw new NotFoundException(`Task with id ${id} is not found`);
        }

        let removedTask = await this.remove(taskToRemove);

        return removedTask;
    }
}
