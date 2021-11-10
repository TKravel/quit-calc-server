const mongoose = require('mongoose');
const { Schema } = mongoose;

const GoalSchema = new Schema({
	user: { type: String },
	goals: { type: Array },
});

const Goal = mongoose.model('Goal', GoalSchema);

module.exports = Goal;
