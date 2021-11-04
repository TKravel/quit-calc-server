import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
	user: String,
	email: String,
	password: String,
});

module.exports = mongoose.model('User', userSchema);