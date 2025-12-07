import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import Joi from 'joi';

// Validation schemas
const createCommentSchema = Joi.object({
  paperId: Joi.number().integer().positive().required(),
  authorName: Joi.string().optional().allow(null).max(200),
  content: Joi.string().required().min(1).max(5000),
});

export const createComment = async (req: Request, res: Response) => {
  try {
    const { error, value } = createCommentSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const comment = await prisma.comment.create({
      data: value,
    });

    logger.info(`Comment created: ${comment.id} for paper ${value.paperId}`);
    res.status(201).json(comment);
  } catch (err) {
    logger.error('Error creating comment:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

export const getCommentsByPaper = async (req: Request, res: Response) => {
  try {
    const paperId = parseInt(req.params.paperId);
    
    if (isNaN(paperId)) {
      return res.status(400).json({ error: 'Invalid paper ID' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { paperId },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.comment.count({
        where: { paperId },
      }),
    ]);

    res.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    logger.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }

    await prisma.comment.delete({
      where: { id },
    });

    logger.info(`Comment deleted: ${id}`);
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Comment not found' });
    }
    logger.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
