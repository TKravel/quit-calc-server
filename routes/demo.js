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

router.get('/createDemoUser', async (req, res) => {
	let testName = createUser();

	const createNewUser = async () => {
		const result = await User.exists({ user: testName });
		if (result) {
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

				res.cookie('auth', token, {
					sameSite: 'none',
					secure: true,
				}).json({ msg: 'Success' });
			} catch (err) {
				if (err) {
					console.log('catch' + err);
					res.status(500).json({ error: 'Internal server error' });
				}
			}
		}
	};

	createNewUser();
});

module.exports = router;
