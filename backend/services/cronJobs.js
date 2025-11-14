import cron from 'node-cron';
import mongoose from 'mongoose';
import Task from '../models/task.model.js';

const updateOverdueTasks = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log('MongoDB not connected. Skipping overdue task update.');
    return;
  }

  console.log('Running cron job: Checking for overdue tasks...');
  const now = new Date();

  try {
    const result = await Task.updateMany(
      {
        // Find tasks where...
        deadline: { $lt: now },
        status: { $in: ['Pending', 'In Progress'] }
      },
      {
        $set: { status: 'Overdue' }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`Cron job: Updated ${result.modifiedCount} tasks to 'Overdue'.`);
    } else {
      console.log('Cron job: No overdue tasks found to update.');
    }
  } catch (error) {
    console.error('Error running overdue tasks cron job:', error);
  }
};

// This example runs at the top of every hour (e.g., 1:00, 2:00, 3:00).
export const startCronJobs = () => {
  cron.schedule('0 * * * *', updateOverdueTasks);
  
  // Optional: Run it once on server start just in case
  updateOverdueTasks(); 
};