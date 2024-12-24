const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, required: true, enum: ['toDo', 'inProgress', 'inReview', 'completed'] },
});

const projectDetailsSchema = new mongoose.Schema({
  toDo: [taskSchema],
  inProgress: [taskSchema],
  inReview: [taskSchema],
  completed: [taskSchema],
});

const projectSchema = new mongoose.Schema({
  // id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  details: { type: projectDetailsSchema, required: true },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
