import prisma from '../config/db.js';
import { sendSuccess } from '../utils/response.js';
import { z } from 'zod';

const summaryQuerySchema = z.object({
  range: z.enum(['this_week', 'this_month', 'this_quarter']).optional().default('this_quarter'),
});

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [
      totalProjects,
      projectsInProgress,
      completedTasks,
      inProgressTasks,
      pendingTasks,
    ] = await prisma.$transaction([
      prisma.project.count({ where: { userId } }),
      prisma.project.count({ where: { userId, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { project: { userId }, status: 'COMPLETED' } }),
      prisma.task.count({ where: { project: { userId }, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { project: { userId }, status: 'PENDING' } }),
    ]);

    const totalTasks = completedTasks + inProgressTasks + pendingTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return sendSuccess(res, {
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      projectsInProgress,
      completionRate,
    }, 200);
  } catch (error) {
    next(error);
  }
};

export const getDashboardSummary = async (req, res, next) => {
  try {
    const query = summaryQuerySchema.safeParse(req.query);
    const range = query.success ? query.data.range : 'this_quarter';
    const userId = req.user.id;

    // Date range helper for due tasks
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Compute all metrics inside a single atomic transaction
    const [
      totalProjects,
      projectsInProgress,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      urgentTasks,
      dueThisWeek,
      activeProjectsRaw,
    ] = await prisma.$transaction([
      // Total projects owned by user
      prisma.project.count({ where: { userId } }),
      // Projects in progress owned by user
      prisma.project.count({ where: { userId, status: 'IN_PROGRESS' } }),
      // Completed tasks
      prisma.task.count({ where: { project: { userId }, status: 'COMPLETED' } }),
      // In Progress tasks
      prisma.task.count({ where: { project: { userId }, status: 'IN_PROGRESS' } }),
      // Pending tasks
      prisma.task.count({ where: { project: { userId }, status: 'PENDING' } }),
      // Urgent tasks (HIGH priority and not yet completed)
      prisma.task.count({
        where: {
          project: { userId },
          priority: 'HIGH',
          status: { in: ['PENDING', 'IN_PROGRESS'] },
        },
      }),
      // Tasks due this week
      prisma.task.count({
        where: {
          project: { userId },
          dueDate: { gte: startOfWeek, lte: endOfWeek },
        },
      }),
      // Active projects with their tasks for progress bars
      prisma.project.findMany({
        where: { userId, status: 'IN_PROGRESS' },
        orderBy: { createdAt: 'desc' },
        take: 4,
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          startDate: true,
          endDate: true,
          tasks: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      }),
    ]);

    // Guarantees: completed + inProgress + pending = totalTasks
    const totalTasks = completedTasks + inProgressTasks + pendingTasks;

    // Zero-division guard on completionRate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Percentages from the same counts summing to exactly 100
    let completedPct = 0;
    let inProgressPct = 0;
    let pendingPct = 0;

    if (totalTasks > 0) {
      completedPct = Math.round((completedTasks / totalTasks) * 100);
      inProgressPct = Math.round((inProgressTasks / totalTasks) * 100);
      // Ensure sum equals exactly 100%
      pendingPct = Math.max(0, 100 - completedPct - inProgressPct);
    }

    // Format active projects with progress percentage
    const activeProjects = activeProjectsRaw.map((p) => {
      const projTotal = p.tasks.length;
      const projDone = p.tasks.filter((t) => t.status === 'COMPLETED').length;
      const progressPct = projTotal > 0 ? Math.round((projDone / projTotal) * 100) : 0;
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        startDate: p.startDate,
        endDate: p.endDate,
        totalTasks: projTotal,
        completedTasks: projDone,
        progressPct,
      };
    });

    return sendSuccess(res, {
      range,
      totalProjects,
      projectsInProgress,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionRate,
      completedPct,
      inProgressPct,
      pendingPct,
      urgentTasks,
      dueThisWeek,
      activeProjects,
    }, 200);
  } catch (error) {
    next(error);
  }
};
