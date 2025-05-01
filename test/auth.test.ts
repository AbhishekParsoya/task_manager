import { expect } from 'chai';
import sinon from 'sinon';
import * as AuthController from '../src/controllers/auth.controller';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Auth Controller', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('register', () => {
    it('should register user and return 201', async () => {
      req.body = {
        name: 'Abhi',
        email: 'abhi@example.com',
        password: 'pass123',
        role: 'user'
      };

      const mockHashed = 'hashedpass123';
      const mockUser = { _id: '1', ...req.body, password: mockHashed };

      sinon.stub(bcrypt, 'hash').resolves(mockHashed);
      sinon.stub(User, 'create').resolves(mockUser as any);

      await AuthController.register(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'User registered', user: mockUser })).to.be.true;
    });

    it('should handle errors during registration', async () => {
      sinon.stub(bcrypt, 'hash').throws(new Error('Hash failed'));

      await AuthController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Registration failed' })).to.be.true;
    });
  });

  describe('login', () => {
    it('should login and return token', async () => {
      req.body = {
        email: 'abhi@example.com',
        password: 'pass123'
      };

      const mockUser = {
        _id: '1',
        email: req.body.email,
        password: 'hashedpass123',
        role: 'user'
      };

      sinon.stub(User, 'findOne').resolves(mockUser as any);
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('mockToken' as any);

      await AuthController.login(req, res);

      expect(res.json.calledWithMatch({ email: mockUser.email, _id: mockUser._id, token: 'mockToken' })).to.be.true;
    });

    it('should return 401 for invalid credentials', async () => {
      req.body = { email: 'wrong@example.com', password: 'wrongpass' };
      sinon.stub(User, 'findOne').resolves(null);

      await AuthController.login(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Invalid credentials' })).to.be.true;
    });

    it('should handle login errors', async () => {
      sinon.stub(User, 'findOne').throws(new Error('DB error'));

      await AuthController.login(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Login error' })).to.be.true;
    });
  });
});
