const Task = require('../models/taskModel');

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, assignedPerson } = req.body;

    if (!title || !description || !priority || !status || !dueDate || !assignedPerson) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Priority must be LOW, MEDIUM, or HIGH' });
    }

    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status must be PENDING, IN_PROGRESS, or COMPLETED' });
    }

    const existingTask = await Task.findOne({ title: title.trim() });
    if (existingTask) {
      return res.status(409).json({ message: 'A task with this title already exists' });
    }

    const task = await Task.create({ title, description, priority, status, dueDate, assignedPerson });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A task with this title already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    if (req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Only Admin users can update full task details' });
    }

    const { title, description, priority, status, dueDate, assignedPerson } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title && title.trim() !== task.title) {
      const duplicate = await Task.findOne({ title: title.trim() });
      if (duplicate) {
        return res.status(409).json({ message: 'A task with this title already exists' });
      }
    }

    if (priority) {
      const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Priority must be LOW, MEDIUM, or HIGH' });
      }
    }

    if (status) {
      const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Status must be PENDING, IN_PROGRESS, or COMPLETED' });
      }
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    task.assignedPerson = assignedPerson || task.assignedPerson;

    const updatedTask = await task.save();

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A task with this title already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status must be PENDING, IN_PROGRESS, or COMPLETED' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    const updatedTask = await task.save();

    res.status(200).json({ message: 'Task status updated successfully', task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Only Admin users can delete tasks' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
