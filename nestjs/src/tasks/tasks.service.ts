import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    this.logger.log('Fetching all tasks');
    const tasks = await this.tasksRepository.find();
    this.logger.debug(`Found ${tasks.length} tasks`);
    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    this.logger.log(`Fetching task with ID ${id}`);
    const task = await this.tasksRepository.findOne({ where: { id } });
    return task;
  }

  async createTask(title: string, description: string): Promise<Task> {
    this.logger.log('Creating a new task');
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await this.tasksRepository.save(task);
    this.logger.debug(`Task created with ID ${task.id}`);
    return task;
  }

  async updateTask(
    id: string,
    title: string,
    description: string,
    status: TaskStatus,
  ): Promise<Task> {
    this.logger.log(`Updating task with ID ${id}`);
    const task = await this.getTaskById(id);
    task.title = title;
    task.description = description;
    task.status = status;
    task.updated_at = new Date();
    await this.tasksRepository.save(task);
    this.logger.debug(`Task with ID ${id} updated`);
    return task;
  }

  async deleteTask(id: string): Promise<number> {
    this.logger.log(`Deleting task with ID ${id}`);
    const result = await this.tasksRepository.delete(id);
    this.logger.debug(`Task with ID ${id} deleted`);
    return result.affected || 0;
  }
}
