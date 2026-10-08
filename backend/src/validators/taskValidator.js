import { z } from 'zod';

export const taskSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  name: z.string().trim().min(1, 'Task name is required').max(255),
  description: z.string().trim().max(1000).optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
});

export const taskUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Task name cannot be empty').max(255).optional(),
  description: z.string().trim().max(1000).optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format').optional(),
  projectId: z.string().optional(),
});
