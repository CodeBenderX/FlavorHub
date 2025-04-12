import authController from '../Controllers/auth.controller.js';
import User from '../Models/user.model.js';
import jwt from 'jsonwebtoken';

jest.mock('../Models/user.model.js');
jest.mock('jsonwebtoken');

describe('authController.signin', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      cookie: jest.fn()
    };
  });

  it('should return 401 if user not found', async () => {
    User.findOne.mockResolvedValue(null);

    await authController.signin(req, res);

    expect(res.status).toHaveBeenCalledWith('401');
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should return 401 if password does not match', async () => {
    const mockUser = {
      authenticate: jest.fn().mockReturnValue(false)
    };
    User.findOne.mockResolvedValue(mockUser);

    await authController.signin(req, res);

    expect(res.status).toHaveBeenCalledWith('401');
    expect(res.json).toHaveBeenCalledWith({ error: "Could not sign in" });
  });

  it('should return token and user if login is successful', async () => {
    const mockUser = {
      _id: '12345',
      name: 'Test User',
      email: 'test@example.com',
      admin: false,
      authenticate: jest.fn().mockReturnValue(true)
    };
    const token = 'mock-jwt-token';
    User.findOne.mockResolvedValue(mockUser);
    jwt.sign.mockReturnValue(token);

    await authController.signin(req, res);

    expect(res.cookie).toHaveBeenCalledWith('t', token, expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({
      token,
      user: {
        _id: '12345',
        name: 'Test User',
        email: 'test@example.com',
        admin: false
      }
    });
  });
});
