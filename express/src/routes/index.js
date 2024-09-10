const express = require('express');
const db = require('../config/connection');
const logger = require('../config/logger');
const formatResponse = require('../utils/responseFormatter');
const router = express.Router();

const allowedStatuses = [ 'OPEN','REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED', 'IN_PROGRESS', 'DONE']

const isValidStatus = (status) => allowedStatuses.includes(status);

router.get('/tasks', async (req, res) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    logger.info(`Data found: ${rows.length}`);
    res.status(200).json(formatResponse(200, 'Data found', rows));
  } catch (err) {
    logger.error(`Error fetching tasks: ${err.message}`);
    res.status(500).json(formatResponse(500, 'Error fetching tasks', { error: err.message }));
  }
});

// Create a new task
router.post('/tasks', async (req, res) => {
  const { title, description, status } = req.body;

  // Validate status
  if (status && !isValidStatus(status)) {
    logger.warn(`400 Invalid status: ${status}`);
    return res.status(400).json(formatResponse(400, `Invalid status. Allowed statuses: ${allowedStatuses.join(', ')}`));
  }

  try {
    const result = await new Promise((resolve, reject) => {
      db.run('INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)', [ title, description, status || 'OPEN' ], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
    logger.info(`Task created with ID: ${result}`);
    res.status(201).json(formatResponse(201, 'Task created successfully', { id: result, title, status: status || 'OPEN' }));
  } catch (err) {
    logger.error(`Error creating task: ${err.message}`);
    res.status(500).json(formatResponse(500, 'Error creating task', { error: err.message }));
  }
});

// Get a task by ID
router.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const row = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM tasks WHERE id = ?', [ id ], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    if (row) {
      res.status(200).json(formatResponse(200, 'Data found', row));
    } else {
      logger.warn(`Task with ID ${id} not found`);
      res.status(404).json(formatResponse(404, 'Task not found'));
    }
  } catch (err) {
    logger.error(`Error fetching task with ID ${id}: ${err.message}`);
    res.status(500).json(formatResponse(500, 'Error fetching task', { error: err.message }));
  }
});

// Update a task by ID
router.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  // Validate status
  if (status && !isValidStatus(status)) {
    return res.status(400).json(formatResponse(400, `Invalid status. Allowed statuses: ${allowedStatuses.join(', ')}`));
  }

  try {
    const changes = await new Promise((resolve, reject) => {
      db.run('UPDATE tasks SET title = ?, status = ?,description=?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [ title, description, status, id ], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
    if (changes === 0) {
      logger.warn(`Task with ID ${id} not found for update`);
      res.status(404).json(formatResponse(404, 'Task not found'));
    } else {
      logger.info(`Task with ID ${id} updated successfully`);
      res.status(200).json(formatResponse(200, 'Task updated successfully'));
    }
  } catch (err) {
    logger.error(`Error updating task with ID ${id}: ${err.message}`);
    res.status(500).json(formatResponse(500, 'Error updating task', { error: err.message }));
  }
});

// Delete a task by ID
router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const changes = await new Promise((resolve, reject) => {
      db.run('DELETE FROM tasks WHERE id = ?', [ id ], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
    if (changes === 0) {
      logger.warn(`Task with ID ${id} not found for deletion`);
      res.status(404).json(formatResponse(404, 'Task not found'));
    } else {
      logger.info(`Task with ID ${id} deleted successfully`);
      res.status(200).json(formatResponse(200, 'Task deleted successfully'));
    }
  } catch (err) {
    logger.error(`Error deleting task with ID ${id}: ${err.message}`);
    res.status(500).json(formatResponse(500, 'Error deleting task', { error: err.message }));
  }
});

module.exports = router;
