import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('/tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getAllTasks(): Task[] {
        return this.tasksService.getAllTasks();
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTaskByID(@Param('id') id: string): Task {
        return this.tasksService.deleteTaskById(id);
    }

    // @Patch('/:id/status')
    // updateTaskById(@Param('id') id: string) {
        
    // }

    // @Post()
    // createTask(@Body() body): any {
    //     if (body.title != null && body.description != null) {
    //         return this.tasksService.createTask(body.title, body.description);
    //     }

    //     return {msg: "error"};
    // }
}
