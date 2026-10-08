import prisma from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getProjects = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const userId = req.user.id;

    const where = {
      userId,
    };

    if (status && ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      where.status = status;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      where.name = {
        contains: search.trim(),
      };
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tasks: true },
        },
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    // Format output with task completion metrics
    const formatted = projects.map((p) => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter((t) => t.status === 'COMPLETED').length;
      const { tasks, ...rest } = p;
      return {
        ...rest,
        totalTasks,
        completedTasks,
        progressPct: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      };
    });

    return sendSuccess(res, { projects: formatted, total: formatted.length }, 200);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId, // Strict ownership check
      },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      return sendError(res, 'Project not found or you are not authorized to view it.', 404);
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter((t) => t.status === 'COMPLETED').length;

    return sendSuccess(res, {
      project: {
        ...project,
        totalTasks,
        completedTasks,
        progressPct: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
    }, 200);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description, status, startDate, endDate } = req.body;
    const userId = req.user.id;

    const project = await prisma.project.create({
      data: {
        userId,
        name: name.trim(),
        description: description?.trim() || null,
        status: status || 'IN_PROGRESS',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return sendSuccess(res, { project }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description, status, startDate, endDate } = req.body;

    // Verify ownership
    const existing = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return sendError(res, 'Project not found or you are not authorized to modify it.', 404);
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (status !== undefined) updateData.status = status;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);

    const updated = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return sendSuccess(res, { project: updated }, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const existing = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return sendError(res, 'Project not found or you are not authorized to delete it.', 404);
    }

    await prisma.project.delete({
      where: { id },
    });

    return sendSuccess(res, { message: 'Project and all associated tasks deleted successfully.' }, 200);
  } catch (error) {
    next(error);
  }
};
