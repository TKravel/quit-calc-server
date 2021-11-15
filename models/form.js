const mongoose = require('mongoose');
const { Schema } = mongoose;

const formSchema = new Schema({
	user: { type: String, required: true },
	packs: { type: String, required: true },
	price: { type: String, required: true },
	quitDate: { type: Date, required: true },
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
