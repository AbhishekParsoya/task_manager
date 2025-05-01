import { expect } from 'chai';
import sinon from 'sinon';
import * as TaskController from '../src/controllers/task.controller';
import Task from '../src/models/Task';
import redisClient from '../src/utils/redis';

describe('Task Controller', () => {
  let req: any;
  let res: any;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;

  beforeEach(() => {
    jsonStub = sinon.stub();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = { status: statusStub, json: jsonStub };
    sinon.stub(redisClient, 'del').resolves(1);
    sinon.stub(redisClient, 'setEx').resolves('OK');
  });

  afterEach(() => sinon.restore());

  describe('createTask', () => {
    it('should create a task and return success', async () => {
      req = { body: { title: 'Test' }, authInfo: { userId: 'uid' } };
      const mockTask = { _id: '1', title: 'Test' };
      sinon.stub(Task, 'create').resolves(mockTask as any);
      await TaskController.createTask(req, res);
      expect(statusStub.calledWith(200)).to.be.true;
    });

    it('should return error if creation fails', async () => {
      req = { body: {}, authInfo: { userId: 'uid' } };
      sinon.stub(Task, 'create').throws(new Error('fail'));
      await TaskController.createTask(req, res);
      expect(statusStub.calledWith(400)).to.be.true;
    });
  });

  describe('getAllTasks', () => {
    it('should return cached tasks if present', async () => {
      req = { query: {} };
      sinon.stub(redisClient, 'get').resolves(JSON.stringify([{ title: 'cached' }]));
      await TaskController.getAllTasks(req, res);
      expect(jsonStub.calledWith([{ title: 'cached' }])).to.be.true;
    });

    it('should fetch tasks and cache them if not in cache', async () => {
      req = { query: {} };
      sinon.stub(redisClient, 'get').resolves(null);
      sinon.stub(Task, 'find').returns({ populate: () => ({ lean: async () => [{ title: 'fresh' }] }) } as any);
      await TaskController.getAllTasks(req, res);
      expect(jsonStub.calledWith({ message: 'Successfully All The Tasks ', result: [{ title: 'fresh' }] })).to.be.true;
    });

    it('should return error if fetch fails', async () => {
      req = { query: {} };
      sinon.stub(redisClient, 'get').throws(new Error('err'));
      await TaskController.getAllTasks(req, res);
      expect(statusStub.calledWith(500)).to.be.true;
    });
  });

  describe('getTask', () => {
    it('should return task if found', async () => {
      req = { params: { id: '1' } };
      sinon.stub(Task, 'findById').returns({ populate: async () => ({ _id: '1' }) } as any);
      await TaskController.getTask(req, res);
      expect(jsonStub.calledWith({ message: 'Successfully Fetched The Task', result: { _id: '1' } })).to.be.true;
    });

    it('should return 404 if task not found', async () => {
      req = { params: { id: '1' } };
      sinon.stub(Task, 'findById').returns({ populate: async () => null } as any);
      await TaskController.getTask(req, res);
      expect(statusStub.calledWith(404)).to.be.true;
    });

    it('should handle error', async () => {
      req = { params: { id: '1' } };
      sinon.stub(Task, 'findById').throws(new Error('fail'));
      await TaskController.getTask(req, res);
      expect(statusStub.calledWith(500)).to.be.true;
    });
  });

  describe('updateTask', () => {
    it('should update task and return result', async () => {
      req = { params: { id: '1' }, body: { title: 'New' } };
      sinon.stub(Task, 'findByIdAndUpdate').resolves({ _id: '1', title: 'New' });
      await TaskController.updateTask(req, res);
      expect(jsonStub.calledWith({ message: 'Successfully Updated The Task', result: { _id: '1', title: 'New' } })).to.be.true;
    });

    it('should return 404 if task not found', async () => {
      req = { params: { id: '1' }, body: {} };
      sinon.stub(Task, 'findByIdAndUpdate').resolves(null);
      await TaskController.updateTask(req, res);
      expect(statusStub.calledWith(404)).to.be.true;
    });

    it('should handle update error', async () => {
      req = { params: { id: '1' }, body: {} };
      sinon.stub(Task, 'findByIdAndUpdate').throws(new Error('fail'));
      await TaskController.updateTask(req, res);
      expect(statusStub.calledWith(500)).to.be.true;
    });
  });

  describe('deleteTask', () => {
    it('should delete task and return success', async () => {
      req = { params: { id: '1' } };
      sinon.stub(Task, 'findByIdAndDelete').resolves({ _id: '1' });
      await TaskController.deleteTask(req, res);
      expect(jsonStub.calledWith({ message: 'Task deleted successfully' })).to.be.true;
    });

    it('should return 404 if task not found', async () => {
      req = { params: { id: '1' } };
      sinon.stub(Task, 'findByIdAndDelete').resolves(null);
      await TaskController.deleteTask(req, res);
      expect(statusStub.calledWith(404)).to.be.true;
    });

    it('should handle deletion error', async () => {
      req = { params: { id: '1' } };
      sinon.stub(Task, 'findByIdAndDelete').throws(new Error('fail'));
      await TaskController.deleteTask(req, res);
      expect(statusStub.calledWith(500)).to.be.true;
    });
  });
});