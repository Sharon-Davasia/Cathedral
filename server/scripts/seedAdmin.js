import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from '../config/db.js';
import { logger } from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@certifypro.com' });
    if (existingAdmin) {
      logger.info('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@certifypro.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    logger.info('Admin user created successfully:');
    logger.info(`Email: ${admin.email}`);
    logger.info(`Password: admin123`);
    logger.info('Please change the password after first login.');

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
