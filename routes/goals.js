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

	const query = { user: userID },
		update = { $push: { goals: { goal: goal, goalCost: goalCost } } },
		options = { upsert: true, new: true, safe: true };

	Goal.findOneAndUpdate(query, update, options, (err, result) => {
		if (err) {
			console.log(err);
			res.status(500).json({ error: 'Internal server error' });
		}
		if (result) {
			const goalCount = result.goals.length;

			res.status(200).json({ count: goalCount, doc: result });
		}
	}).select('-user -_id -__v');
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
			const goalCount = result[0].goals.length;
			console.log('results found');
			console.log(result);
			res.json({ docs: result, count: goalCount });
		}
	}).select('-user -_id -__v');
});

router.post('/delete_goal', verifyUser, (req, res, next) => {
	const userID = req.id;
	const item = req.body.item;

	console.log(userID, req.body);

	Goal.findOneAndUpdate(
		{ user: userID },
		{ $pull: { goals: { goal: item } } },
		{ new: true },
		(err, result) => {
			if (err) {
				console.log(err);
				res.status(500).json({ error: 'Internal server error' });
			}
			if (result) {
				const count = result.goals.length;
				console.log('item removed from goal array');
				res.status(200).json({
					msg: 'success',
					goalArr: result,
					count: count,
				});
			}
		}
	).select('-user -_id -__v');
});

router.post('/completed_goal', verifyUser, (req, res, next) => {
	const userID = req.id;

	const goal = req.body.goal;
	const cost = req.body.cost;
	console.log(goal, cost);

	Goal.findOneAndUpdate(
		{ user: userID },
		{
			$pull: { goals: { goal: goal } },
			$push: {
				completedGoals: {
					goal: goal,
					goalCost: cost,
				},
			},
		},
		{ new: true },
		(err, result) => {
			if (err) {
				console.log(err);
				res.status(500).json({ error: 'Internal server error' });
			}
			if (result) {
				const count = result.goals.length;

				// const completedGoal = result.goals.slice(index, index + 1);

				console.log('item removed from goal array');
				res.status(200).json({
					msg: 'success',
					doc: result,
					count: count,
				});
			}
		}
	).select('-user -_id -__v');
});

module.exports = router;
