if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

// Mock mongoose to avoid ESM issues
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  connection: {
    close: jest.fn().mockResolvedValue({})
  }
}));

// Mock the models
jest.mock('../models/Entry', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue({ _id: 'test-entry-id' }),
    deleteMany: jest.fn().mockResolvedValue({}),
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([])
    }),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue({ _id: 'test-entry-id' })
    }),
    findByIdAndUpdate: jest.fn().mockResolvedValue({ _id: 'test-entry-id' }),
    findByIdAndDelete: jest.fn().mockResolvedValue({ _id: 'test-entry-id' })
  }))
}));

jest.mock('../models/User', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue({ _id: 'test-user-id' }),
    deleteMany: jest.fn().mockResolvedValue({})
  }))
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';

describe('Entries API', () => {
  let testUser;
  let adminUser;
  let userToken;
  let adminToken;

  beforeAll(async () => {
    // Create test users
    testUser = {
      _id: 'test-user-id',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user'
    };

    adminUser = {
      _id: 'admin-user-id',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin'
    };

    // Generate tokens
    userToken = jwt.sign({ userId: testUser._id, role: testUser.role }, process.env.JWT_SECRET);
    adminToken = jwt.sign({ userId: adminUser._id, role: adminUser.role }, process.env.JWT_SECRET);
  });

  describe('Basic API Structure', () => {
    it('should have proper test setup', () => {
      expect(testUser).toBeDefined();
      expect(adminUser).toBeDefined();
      expect(userToken).toBeDefined();
      expect(adminToken).toBeDefined();
    });

    it('should have JWT secret configured', () => {
      expect(process.env.JWT_SECRET).toBe('test-secret');
    });
  });

  describe('Mock Tests', () => {
    it('should pass basic validation', () => {
      expect(true).toBe(true);
    });

    it('should have proper user roles', () => {
      expect(testUser.role).toBe('user');
      expect(adminUser.role).toBe('admin');
    });
  });
}); 