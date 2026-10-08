import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { projectSchema, projectUpdateSchema } from '../validators/projectValidator.js';

const router = Router();

// Protect all project routes
router.use(authenticateToken);

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', validate(projectSchema), createProject);
router.put('/:id', validate(projectUpdateSchema), updateProject);
router.delete('/:id', deleteProject);

export default router;
