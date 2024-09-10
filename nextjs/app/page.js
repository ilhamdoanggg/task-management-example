'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
	const [tasks, setTasks] = useState([]);
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [newTaskDescription, setNewTaskDescription] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		fetchTasks();
	}, []);

	const fetchTasks = async () => {
		try {
			const response = await axios.get('http://localhost:3001/tasks');
			setTasks(response.data.data);
		} catch (error) {
			setError('Error fetching tasks');
		}
	};

	const addTask = async (e) => {
		e.preventDefault();

		if (!newTaskTitle.trim() || !newTaskDescription.trim()) {
			setError('Title and Description cannot be empty');
			return;
		}

		try {
			setLoading(true);
			const newTask = {
				title: newTaskTitle,
				description: newTaskDescription,
				status: 'OPEN',
			};
			await axios.post('http://localhost:3001/tasks', newTask);
			setNewTaskTitle('');
			setNewTaskDescription('');
			fetchTasks();
		} catch (error) {
			setError('Error adding task');
		} finally {
			setLoading(false);
			setError('');
		}
	};

	return (
		<div className='flex w-full flex-col items-center justify-center bg-white mobile:p-4'>
			<h1>Task List</h1>
			<div className='flex w-full max-w-sm items-center space-x-2'>
				<form onSubmit={addTask} className='flex gap-2'>
					<Input
						type='text'
						value={newTaskTitle}
						onChange={(e) => setNewTaskTitle(e.target.value)}
						placeholder='Task Title'
						required
					/>
					<Input
						type='text'
						value={newTaskDescription}
						onChange={(e) => setNewTaskDescription(e.target.value)}
						placeholder='Task Description'
						required
					/>
					<Button variant='default' type='submit' disabled={loading}>
						Add Task
					</Button>
				</form>
			</div>

			{error && (
				<Alert variant='destructive' title='Delete your account'>
					{error}
				</Alert>
			)}
			<br></br>
			<table className='text-slate-700 bg-white shadow-md rounded-xl bg-clip-border  mt-4 text-left table-auto min-w-max'>
				<thead className='bg-gray-light border-b'>
					<tr>
						<th >Id</th>
						<th >Title</th>
						<th >Description</th>
						<th >Status</th>
					</tr>
				</thead>
				<tbody >
					{tasks.map((task) => (
						<tr key={task.id} className='px-2'>
							<td>{task.id}</td>
							<td>{task.title}</td>
							<td>{task.description}</td>
							<td style={{ color: getStatusColor(task.status) }}>{task.status}</td>
						</tr>
					))}
				</tbody>
			</table>

		</div>
	);
}
const getStatusColor = (status) => {
	switch (status) {
		case 'OPEN':
			return 'blue';
		case 'REVIEW':
			return 'orange';
		case 'APPROVED':
			return 'green';
		case 'REJECTED':
			return 'purple';
		case 'CANCELLED':
			return 'red';
		case 'IN_PROGRESS':
			return 'purple';
		case 'DONE':
			return 'pink';
		default:
			return 'black';
	}
};
//blue: '#1fb6ff',
// purple: '#7e5bef',
// pink: '#ff49db',
// orange: '#ff7849',
// green: '#13ce66',
// yellow: '#ffc82c',
// 'gray-dark': '#273444',
// gray: '#8492a6',
// 'gray-light': '#d3dce6',
