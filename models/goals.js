import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const GoalSchema = new Schema({});

export default model('Goal', GoalSchema);
