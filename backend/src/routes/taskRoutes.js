import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { taskSchema, taskUpdateSchema } from '../validators/taskValidator.js';

const router = Router();

// Protect all task routes
router.use(authenticateToken);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', validate(taskSchema), createTask);
router.put('/:id', validate(taskUpdateSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
