import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    Query,
    UsePipes,
    ValidationPipe,
    ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';

@Controller('/tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    // @Get()
    // getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Task[] {
    //     if (Object.keys(filterDto).length) {
    //         return this.tasksService.getTaskWithFilters(filterDto);
    //     }
    //     return this.tasksService.getAllTasks();
    // }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    // @Delete('/:id')
    // deleteTaskByID(@Param('id') id: string): Task {
    //     return this.tasksService.deleteTaskById(id);
    // }

    // @Patch('/:id/status')
    // updateTaskById(
    //     @Param('id') id: string,
    //     @Body('status', TaskStatusValidationPipe) status: TaskStatus
    // ): Task {
    //     return this.tasksService.updateTaskById(id, status);
    // }





    // @Post()
    // createTask(@Body() body): any {
    //     if (body.title != null && body.description != null) {
    //         return this.tasksService.createTask(body.title, body.description);
    //     }

    //     return {msg: "error"};
    // }
}
