import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import Joi from 'joi';

// Validation schemas
const createPaperSchema = Joi.object({
  arxivId: Joi.string().optional().allow(null),
  title: Joi.string().required().max(500),
  abstract: Joi.string().required().max(8000),
  url: Joi.string().required().max(2000),
  submittedBy: Joi.string().optional().allow(null).max(200),
  explanation: Joi.object({
    authorName: Joi.string().optional().allow(null).max(200),
    summary: Joi.string().required().max(8000),
    intuition: Joi.string().required().max(8000),
    technical: Joi.string().optional().allow(null).max(8000),
    codeUrl: Joi.string().optional().allow(null).max(2000),
  }).optional(),
});

const updatePaperSchema = Joi.object({
  arxivId: Joi.string().optional().allow(null),
  title: Joi.string().optional().max(500),
  abstract: Joi.string().optional().max(8000),
  url: Joi.string().optional().max(2000),
  submittedBy: Joi.string().optional().allow(null).max(200),
});

export const createPaper = async (req: Request, res: Response) => {
  try {
    const { error, value } = createPaperSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { explanation, ...paperData } = value;

    const paper = await prisma.paper.create({
      data: {
        ...paperData,
        explanations: explanation ? {
          create: explanation
        } : undefined,
      },
      include: {
        explanations: true,
      },
    });

    logger.info(`Paper created: ${paper.id}`);
    res.status(201).json(paper);
  } catch (err) {
    logger.error('Error creating paper:', err);
    res.status(500).json({ error: 'Failed to create paper' });
  }
};

export const getPapers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        skip,
        take: limit,
        include: {
          explanations: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.paper.count(),
    ]);

    res.json({
      papers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    logger.error('Error fetching papers:', err);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
};

export const getPaperById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid paper ID' });
    }

    const paper = await prisma.paper.findUnique({
      where: { id },
      include: {
        explanations: true,
      },
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    res.json(paper);
  } catch (err) {
    logger.error('Error fetching paper:', err);
    res.status(500).json({ error: 'Failed to fetch paper' });
  }
};

export const updatePaper = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid paper ID' });
    }

    const { error, value } = updatePaperSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const paper = await prisma.paper.update({
      where: { id },
      data: value,
      include: {
        explanations: true,
      },
    });

    logger.info(`Paper updated: ${id}`);
    res.json(paper);
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Paper not found' });
    }
    logger.error('Error updating paper:', err);
    res.status(500).json({ error: 'Failed to update paper' });
  }
};

export const deletePaper = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid paper ID' });
    }

    await prisma.paper.delete({
      where: { id },
    });

    logger.info(`Paper deleted: ${id}`);
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Paper not found' });
    }
    logger.error('Error deleting paper:', err);
    res.status(500).json({ error: 'Failed to delete paper' });
  }
};
