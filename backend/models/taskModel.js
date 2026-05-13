const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: ['LOW', 'MEDIUM', 'HIGH'],
        message: 'Priority must be LOW, MEDIUM, or HIGH',
      },
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
        message: 'Status must be PENDING, IN_PROGRESS, or COMPLETED',
      },
      default: 'PENDING',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    assignedPerson: {
      type: String,
      required: [true, 'Assigned person is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
