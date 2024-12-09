import { Request, Response } from 'express';
import Memory from '../models/Memory';
import { validateMemory, validateComment } from '../validators/memory.validator';
import { handleError } from '../utils/errorHandler';

export const createMemory = async (req: Request, res: Response) => {
  try {
    const { error } = validateMemory(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const memory = new Memory({
      ...req.body,
      userId: req.user.id,
      companyId: req.user.companyId,
    });

    await memory.save();
    res.status(201).json(memory);
  } catch (error) {
    handleError(res, error);
  }
};

export const getMemories = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      visibility,
      tags,
      startDate,
      endDate,
      search,
    } = req.query;

    const query: any = { companyId: req.user.companyId };

    // Apply filters
    if (type) query.type = type;
    if (visibility) query.visibility = visibility;
    if (tags) query.tags = { $all: (tags as string).split(',') };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const memories = await Memory.find(query)
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Memory.countDocuments(query);

    res.json({
      memories,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getMemoryById = async (req: Request, res: Response) => {
  try {
    const memory = await Memory.findById(req.params.id)
      .populate('userId', 'name avatar')
      .populate('comments.userId', 'name avatar');

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    if (
      memory.visibility === 'private' &&
      memory.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(memory);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateMemory = async (req: Request, res: Response) => {
  try {
    const { error } = validateMemory(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    if (memory.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(memory, req.body);
    await memory.save();

    res.json(memory);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteMemory = async (req: Request, res: Response) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    if (memory.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await memory.deleteOne();
    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

export const likeMemory = async (req: Request, res: Response) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    const likeIndex = memory.likes.indexOf(req.user.id);
    if (likeIndex === -1) {
      memory.likes.push(req.user.id);
    } else {
      memory.likes.splice(likeIndex, 1);
    }

    await memory.save();
    res.json({ likes: memory.likes });
  } catch (error) {
    handleError(res, error);
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { error } = validateComment(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    const comment = {
      userId: req.user.id,
      content: req.body.content,
      createdAt: new Date(),
    };

    memory.comments.push(comment);
    await memory.save();

    const populatedMemory = await Memory.findById(memory._id).populate(
      'comments.userId',
      'name avatar'
    );

    res.json(populatedMemory?.comments);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    const comment = memory.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    comment.deleteOne();
    await memory.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};