import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.model';
import { formatResponse } from '../utils/response.util';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks() {
    const tasks = await this.tasksService.getAllTasks();
    return formatResponse(200, 'Tasks fetched successfully', tasks);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    const task = await this.tasksService.getTaskById(id);
    if (task) {
      return formatResponse(200, 'Task fetched successfully', task);
    } else {
      return formatResponse(404, 'Task not found', null);
    }
  }

  @Post()
  async createTask(
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    const task = await this.tasksService.createTask(title, description);
    return formatResponse(201, 'Task created successfully', task);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('status') status: TaskStatus,
  ) {
    const updatedTask = await this.tasksService.updateTask(
      id,
      title,
      description,
      status,
    );
    return formatResponse(200, 'Task updated successfully', updatedTask);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    const deletedCount = await this.tasksService.deleteTask(id); // Mengambil hasil penghapusan
    if (deletedCount > 0) {
      return formatResponse(200, 'Task deleted successfully', null);
    } else {
      return formatResponse(404, 'Task not found', null);
    }
  }
}
