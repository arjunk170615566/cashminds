const mongoose = require('mongoose');

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/paisable';

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || DEFAULT_LOCAL_URI;
  const fallbackUris = [primaryUri, DEFAULT_LOCAL_URI];

  for (const uri of fallbackUris) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`Mongo connection failed for ${uri}: ${error.message}`);
      if (uri === DEFAULT_LOCAL_URI) {
        if (process.env.NODE_ENV !== 'test') {
          process.exit(1);
        }
        throw error;
      }
    }
  }

  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  }
};

module.exports = connectDB;
