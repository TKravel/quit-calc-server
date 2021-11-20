const mongoose = require('mongoose');
const { Schema } = mongoose;

const goalSchema = new Schema({
	user: { type: String },
	goals: { type: Array },
	completedGoals: { type: Array },
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
