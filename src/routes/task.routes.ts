// src/routes/task.routes.ts
import { Router } from 'express';
import {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware'

const router = Router();

router.use(authMiddleware);


router.post('/', createTask);

router.get('/', getAllTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', roleMiddleware(['admin']), deleteTask);

export default router;