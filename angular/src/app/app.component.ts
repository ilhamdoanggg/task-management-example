import { Component, OnInit } from '@angular/core';
import axios from 'axios';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  loading: boolean = false;
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  tasks: any[] = [];
  isFilled: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.fetchTasks();
  }

  async fetchTasks() {
    try {
      this.loading = true;
      const response = await axios.get('http://localhost:3001/tasks');
      this.loading = false;
      this.tasks = response.data.data.tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  async addTask() {
    if (!this.newTaskTitle.trim() || !this.newTaskDescription.trim()) {
      // alert('Title and Description cannot be empty.');
      this.isFilled = true;
      return;
    }

    try {
      this.loading = true;
      const newTask = {
        title: this.newTaskTitle,
        description: this.newTaskDescription,
        status: 'OPEN',
      };
      await axios.post('http://localhost:3001/tasks', newTask);
      this.loading = false;
      this.newTaskTitle = '';
      this.newTaskDescription = '';
      this.fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      this.loading = false;
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'OPEN':
        return 'status-open';
      case 'REVIEW':
        return 'status-review';
      case 'APPROVED':
        return 'status-approved';
      case 'REJECTED':
        return 'status-rejected';
      case 'CANCELLED':
        return 'status-cancelled';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'DONE':
        return 'status-done';
      default:
        return '';
    }
  }

}
