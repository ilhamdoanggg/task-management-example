const express = require('express');
const logger = require('../../config/logger');
const formatResponse = require('../../utils/responseFormatter');
const router = express.Router();
const taskService = require('../../services/tasksServices');

router.get('/tasks', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; 
  const offset = parseInt(req.query.offset) || 0;
  try {
    const { tasks, total } = await taskService.getAllTasks(limit, offset);
    if (tasks.length === 0) {
      return res.status(404).json(formatResponse(404, 'No tasks found'));
    }
    const paginationMeta = {
      total,
      limit,
      offset,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
    };

    res.status(200).json(formatResponse(200, 'Tasks retrieved successfully', { tasks, pagination: paginationMeta }));
  } catch (err) {
    logger.error(`Error fetching tasks: ${err.message}`);
    res.status(500).json(formatResponse(500, 'Error fetching tasks', { error: err.message }));
  }
});

router.post('/tasks', async (req, res) => {
  const { title, description, status } = req.body;

  if (status && !taskService.isValidStatus(status)) {
    logger.warn(`400 Invalid status: ${status}`);
    return res.status(400).json(formatResponse(400, `Invalid status. Allowed statuses: ${taskService.allowedStatuses.join(', ')}`));
  }

  try {
    const taskId = await taskService.createTask(title, description, status);
    res.status(201).json(formatResponse(201, 'Task created successfully', { id: taskId, title, status: status || 'OPEN' }));
  } catch (err) {
    logger.error(`Error creating task: ${err.message}`);
    res.status(500).json(formatResponse(500, 'Error creating task', { error: err.message }));
  }
});


router.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await taskService.getTaskById(id);
    if (task) {
      res.status(200).json(formatResponse(200, 'Data found', task));
    } else {
      logger.warn(`Task with ID ${id} not found`);
      res.status(404).json(formatResponse(404, 'Task not found'));
    }
  } catch (err) {
    logger.error(`Error fetching task with ID ${id}: ${err.message}`);
    res.status(500).json(formatResponse(500, 'Error fetching task', { error: err.message }));
  }
});

router.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (status && !taskService.isValidStatus(status)) {
    return res.status(400).json(formatResponse(400, `Invalid status. Allowed statuses: ${taskService.allowedStatuses.join(', ')}`));
  }
  try {
    const updatedTask = await taskService.putTaskById(id, title, description, status);
    if (!updatedTask) {
      return res.status(404).json(formatResponse(404, 'Task not found'));
    }
    res.status(200).json(formatResponse(200, 'Task updated successfully', updatedTask));
  } catch (err) {
    logger.error(`Error updating task with ID ${id}: ${err.message}`);
    res.status(500).json(formatResponse(500, 'Error updating task', { error: err.message }));
  }
});

router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const changes = await taskService.deleteTaskById(id);
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
