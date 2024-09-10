const db = require('../../config/connection');
const logger = require('../../config/logger');
const { v4: uuidv4 } = require('uuid');

const allowedStatuses = [
	'OPEN',
	'REVIEW',
	'APPROVED',
	'REJECTED',
	'CANCELLED',
	'IN_PROGRESS',
	'DONE'
];

const isValidStatus = (status) => allowedStatuses.includes(status);

const createTask = async (title, description, status = 'OPEN') => {
	const id = uuidv4();
	return new Promise((resolve, reject) => {
		db.run(
			'INSERT INTO tasks (id, title, description, status) VALUES (?, ?, ?, ?)',
			[ id, title, description, status ],
			function (err) {
				if (err) {
					logger.error(`Error creating task: ${err.message}`);
					reject(err);
				} else {
					logger.info(`Task created with ID: ${this.lastID}`);
					resolve(this.lastID);
				}
			}
		);
	});
};

const getAllTasks = async (limit, offset) => {
	const tasks = await new Promise((resolve, reject) => {
		db.all('SELECT * FROM tasks LIMIT ? OFFSET ?', [limit, offset], (err, rows) => {
		  if (err) reject(err);
		  else resolve(rows);
		});
	  });
	  const total = await new Promise((resolve, reject) => {
		db.get('SELECT COUNT(*) AS count FROM tasks', [], (err, row) => {
		  if (err) reject(err);
		  else resolve(row.count);
		});
	  });
	  console.log(total)
	return { tasks, total };
}


const getTaskById = async (id) => {
	return new Promise((resolve, reject) => {
		db.get('SELECT * FROM tasks WHERE id = ? AND is_deleted = 0', [ id ], (err, row) => {
			if (err) {
				logger.error(`Error fetching task with ID ${id}: ${err.message}`);
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
};

const deleteTaskById = async (id) => {
	return new Promise((resolve, reject) => {
		db.run('UPDATE tasks SET is_deleted = 1 WHERE id = ?', [ id ], function (err) {
			if (err) {
				logger.error(`Error deleting task with ID ${id}: ${err.message}`);
				reject(err);
			} else {
				resolve(this.changes); // this.changes indicates the number of rows affected
			}
		});
	});
};

const putTaskById = async (id, title, description, status) => {
	return new Promise((resolve, reject) => {
		db.run('UPDATE tasks SET title = ?, status = ?,description=?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [ title, description, status, id ], function (err) {
			if (err) {
				logger.error(`Error updating task with ID ${id}: ${err.message}`);
				reject(err);
			} else {
				resolve(this.changes); // this.changes indicates the number of rows affected
			}
	});
	});
}
module.exports = {
	getAllTasks,
	getAllTasks,
	getTaskById,
	createTask,
	deleteTaskById,
	putTaskById,
	isValidStatus,
	allowedStatuses
};
