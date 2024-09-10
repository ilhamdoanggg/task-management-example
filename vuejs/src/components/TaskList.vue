<template>
	<div class="task-container">
		<h1>Task List</h1>

		<form @submit.prevent="addTask">
			<input v-model="newTaskTitle" placeholder="Enter new task" required />
			<input v-model="newTaskDescription" placeholder="Enter task description" required />
			<button type="submit">Add Task</button>
		</form>

		<br />

		<table>
			<tr>
				<th>ID</th>
				<th>Title</th>
				<th>Description</th>
				<th>Status</th>
				<th>Created At</th>
				<th>Update At</th>
			</tr>
			<tr v-for="task in tasks" :key="task.id" v-bind:class="getStatusClass(task.status)">
				<td>{{ task.id }}</td>
				<td>{{ task.title }}</td>
				<td>{{ task.description }}</td>
				<td>{{ task.status }}</td>
				<td>{{ task.created_at }}</td>
				<td>{{ task.updated_at }}</td>
			</tr>
		</table>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			newTaskTitle: '',
			newTaskDescription: '',
			tasks: [],
		};
	},
	methods: {
		async fetchTasks() {
			try {
				const response = await axios.get('http://localhost:3001/tasks');
				this.tasks = response.data.data;
			} catch (error) {
				console.error('Error fetching tasks:', error);
			}
		},

		async addTask() {
			try {
				const newTask = {
					title: this.newTaskTitle,
					description: this.newTaskDescription,
					status: 'OPEN',
				};
				await axios.post('http://localhost:3001/tasks', newTask);
				this.newTaskTitle = '';
				this.newTaskDescription = '';
				this.fetchTasks();
			} catch (error) {
				console.error('Error adding task:', error);
			}
		},

		getStatusClass(status) {
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
		},
	},
	mounted() {
		this.fetchTasks();
	},
};
</script>

<style scoped>
.task-container {
	max-width: 100vw;
	margin: 0 auto;
	padding: 20px;
    text-align: center;
}

input {
	padding: 10px;
	font-size: 1em;
	margin-right: 10px;
}

button {
	padding: 10px;
	font-size: 1em;
}
table {
	width: 100%;
	border-collapse: collapse;
}

th,
td {
	border: 1px solid #ddd;
	padding: 10px;
	text-align: left;
}

tr.status-open {
	background-color: #e3f2fd;
}

tr.status-review {
	background-color: #fff9c4;
}

tr.status-approved {
	background-color: #c8e6c9;
}

tr.status-rejected {
	background-color: #ffccbc;
}

tr.status-cancelled {
	background-color: #f8bbd0;
}

tr.status-in-progress {
	background-color: #bbdefb;
}

tr.status-done {
	background-color: #dcedc8;
}
</style>
