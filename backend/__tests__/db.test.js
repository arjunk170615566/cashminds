jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

const mongoose = require('mongoose');
const connectDB = require('../config/db');

describe('connectDB', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    delete process.env.MONGO_URI;
    process.exit = jest.fn();
  });

  it('falls back to the local MongoDB instance when the primary URI fails', async () => {
    process.env.MONGO_URI = 'mongodb+srv://example.invalid/test';
    mongoose.connect
      .mockRejectedValueOnce(new Error('ENOTFOUND'))
      .mockResolvedValueOnce({ connection: { host: '127.0.0.1' } });

    await connectDB();

    expect(mongoose.connect).toHaveBeenNthCalledWith(1, 'mongodb+srv://example.invalid/test');
    expect(mongoose.connect).toHaveBeenNthCalledWith(2, 'mongodb://127.0.0.1:27017/paisable');
    expect(process.exit).not.toHaveBeenCalled();
  });
});
