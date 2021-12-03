const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Form = require('../models/form');
const Goal = require('../models/goals');
const jwt = require('jsonwebtoken');
const demoData = require('../utils/demoSetUp');

function createUser() {
	return 'demoUser' + Math.floor(Math.random() * 1000000000);
}

const usernameAvail = async (username) => {
	console.log('test');
	return await User.find({ user: username }, (err, result) => {
		if (err) {
			console.log('find err' + err);
		}
		if (!result) {
			return true;
		} else if (result) {
			return false;
		}
	});
};

router.get('/createDemoUser', async (req, res) => {
	let testName = createUser();

	const createNewUser = async () => {
		const result = await User.exists({ user: testName });
		if (result) {
			console.log('test true');
			testName = createUser();
			createNewUser();
		} else {
			console.log('test false');
			const pw = 'demoPassword' + Math.floor(Math.random() * 1000000);
			const email = 'demoEmail@email.com';

			try {
				const user = await User.create({
					user: testName,
					email: email,
					password: pw,
				});
				const userId = user._id;
				const form = await Form.create({
					user: userId,
					...demoData.form,
				});
				const goal = await Goal.create({
					user: userId,
					goals: [...demoData.goals],
					completedGoals: [...demoData.completedGoals],
				});
				const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

				res.cookie('auth', token).json({ msg: 'Success' });
			} catch (err) {
				if (err) {
					console.log('catch' + err);
					res.status(500).json({ error: 'Internal server error' });
				}
			}
		}
	};

	createNewUser();

	// if (usernameAvail(testName)) {
	// 	const pw = 'demoPassword' + Math.floor(Math.random() * 1000000);
	// 	const email = 'demoEmail@email.com';

	// 	try {
	// 		const user = await User.create({
	// 			user: testName,
	// 			email: email,
	// 			password: pw,
	// 		});
	// 		const userId = user._id;
	// 		console.log(userId);
	// 	} catch (err) {
	// 		if (err) {
	// 			console.log('catch' + err);
	// 		}
	// 	}
	// } else {
	// 	testName = createUser();
	// 	usernameAvail(testName);
	// }
});

module.exports = router;
