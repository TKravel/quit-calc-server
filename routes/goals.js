const express = require('express');
const router = express.Router();
const Goal = require('../models/goals');
const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
	const { auth } = req.cookies;
	console.log(auth);
	if (auth) {
		jwt.verify(auth, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				console.log(err);
			} else if (decoded === false) {
				res.status(401).json({ msg: 'denied' });
			}
			req.id = decoded.id;
			next();
		});
	} else {
		return res.status(401).json({ msg: 'denied' });
	}
};

router.post('/create_goal', verifyUser, (req, res, next) => {
	const { goal, goalCost } = req.body;
	const userID = req.id;

	const newGoal = new Goal({
		user: userID,
	});
});

router.get('/get_goals', verifyUser, (req, res, next) => {
	const userID = req.id;

	console.log('userId ' + userID);

	Goal.find({ user: userID }, (err, result) => {
		if (err) {
			console.log('Goal search err: ' + err);
			res.status(500).json({ error: 'Internal server error' });
		}
		if (result.length === 0) {
			console.log('No user goals found');
			res.status(200).json({ msg: 'none' });
		} else if (result) {
			console.log('results found');
			res.json({ docs: result });
		}
	});
});

module.exports = router;
