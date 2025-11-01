import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { logger } from '../utils/logger.js';

// Added: Validate required .env variables at startup
const validateEnvVariables = () => {
  const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(key => !process.env[key] || process.env[key].trim() === '');
  
  if (missingVars.length > 0) {
    logger.error('Missing required environment variables:');
    missingVars.forEach(key => logger.error(`  - ${key}`));
    logger.error('\nPlease ensure all required variables are set in your .env file.');
    logger.error('For reference, check server/env.example for the required variables.\n');
    process.exit(1);
  }
};

export const connectDB = async () => {
  // Added: Validate .env variables before attempting connection
  validateEnvVariables();
  
  const connectWithUri = async (uri) => {
    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB Connected: ${connection.connection.host}`);
    return connection;
  };

  const mongoUriFromEnv = process.env.MONGO_URI;

  try {
    if (mongoUriFromEnv && mongoUriFromEnv.trim().length > 0) {
      await connectWithUri(mongoUriFromEnv);
      return;
    }
    throw new Error('MONGO_URI not provided; falling back to in-memory MongoDB');
  } catch (primaryError) {
    logger.warn(
      `Primary MongoDB connection failed or missing. Reason: ${primaryError.message}. Falling back to in-memory MongoDB.`
    );

    try {
      const memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();
      await connectWithUri(memoryUri);
      logger.info('Using in-memory MongoDB instance (mongodb-memory-server).');
    } catch (memoryError) {
      logger.error('Failed to start in-memory MongoDB:', memoryError);
      process.exit(1);
    }
  }
};
