import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required').max(150),
  description: z.string().trim().max(1000).optional().nullable(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).default('IN_PROGRESS'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
}).refine((data) => {
  return new Date(data.endDate) >= new Date(data.startDate);
}, {
  message: 'End date cannot be earlier than start date',
  path: ['endDate'],
});

export const projectUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Project name cannot be empty').max(150).optional(),
  description: z.string().trim().max(1000).optional().nullable(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format').optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: 'End date cannot be earlier than start date',
  path: ['endDate'],
});
