import prisma from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getTasks = async (req, res, next) => {
  try {
    const { projectId, status, priority, search } = req.query;
    const userId = req.user.id;

    // Base condition: Task's project MUST belong to the authenticated user
    const where = {
      project: {
        userId,
      },
    };

    if (projectId) {
      where.projectId = projectId;
    }

    if (status && ['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      where.status = status;
    }

    if (priority && ['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
      where.priority = priority;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      where.name = {
        contains: search.trim(),
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    return sendSuccess(res, { tasks, total: tasks.length }, 200);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId, // Ownership verified via relation
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!task) {
      return sendError(res, 'Task not found or you are not authorized to view it.', 404);
    }

    return sendSuccess(res, { task }, 200);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { projectId, name, description, priority, status, dueDate } = req.body;
    const userId = req.user.id;

    // CRITICAL AUTHORIZATION: Verify user owns the target project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return sendError(res, 'Target project does not exist or you do not have permission to add tasks to it.', 404);
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        name: name.trim(),
        description: description?.trim() || null,
        priority: priority || 'MEDIUM',
        status: status || 'PENDING',
        dueDate: new Date(dueDate),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return sendSuccess(res, { task }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description, priority, status, dueDate, projectId } = req.body;

    // CRITICAL AUTHORIZATION: Verify task exists and belongs to a project owned by user
    const existing = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId,
        },
      },
    });

    if (!existing) {
      return sendError(res, 'Task not found or you are not authorized to modify it.', 404);
    }

    // If moving to another project, verify ownership of the new project as well
    if (projectId && projectId !== existing.projectId) {
      const targetProject = await prisma.project.findFirst({
        where: { id: projectId, userId },
      });
      if (!targetProject) {
        return sendError(res, 'Target project does not belong to you.', 403);
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
    if (projectId !== undefined) updateData.projectId = projectId;

    const updated = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return sendSuccess(res, { task: updated }, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // CRITICAL AUTHORIZATION: Verify task belongs to user's project
    const existing = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId,
        },
      },
    });

    if (!existing) {
      return sendError(res, 'Task not found or you are not authorized to delete it.', 404);
    }

    await prisma.task.delete({
      where: { id },
    });

    return sendSuccess(res, { message: 'Task deleted successfully.' }, 200);
  } catch (error) {
    next(error);
  }
};
