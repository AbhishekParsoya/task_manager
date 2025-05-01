// src/controllers/task.controller.ts
import { Request, Response } from 'express';
import Task from '../models/Task';
import redisClient from '../utils/redis';

export const createTask = async (req: Request, res: Response) => {
  try {
    const authInfo = req.authInfo;
    if(authInfo){
      req.body.assignedTo = authInfo.userId;
    }
    const task = await Task.create(req.body);
    await redisClient.del('tasks:all'); // Invalidate cache
    res.status(200).json({ message: 'Task created', result: task });
  } catch (err) {
    res.status(400).json({ message: 'Task creation failed', error: err });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const cached = await redisClient.get('tasks:all');
    if (cached)  { 
      res.json(JSON.parse(cached));
      return;
    }

    const query: any = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.dueDate) query.dueDate = { $lte: new Date(req.query.dueDate as string) };
    if (req.query.assignedTo) query.assignedTo = req.query.assignedTo;

    const tasks = await Task.find(query).populate('assignedTo').lean();
    await redisClient.setEx('tasks:all', 60, JSON.stringify(tasks));
    res.json({ message: "Successfully All The Tasks ", result: tasks});
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo');
    if (!task) {  res.status(404).json({ message: 'Task not found' }) ; return; };
    res.json({message: "Successfully Fetched The Task", result: task});
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task', error: err });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) { res.status(404).json({ message: 'Task not found' }); return;};
    await redisClient.del('tasks:all');
    res.json({ message: "Successfully Updated The Task", result: task });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {  res.status(404).json({ message: 'Task not found' }); return;};
    await redisClient.del('tasks:all');
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err });
  }
};
