import { Request, Response } from 'express';
import User from '../models/User';
const bcrypt = require('bcryptjs');

import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed', error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    res.json({email: user.email, _id : user._id, token });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err });
  }
};
