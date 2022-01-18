const express = require('express');
const router = express.Router();
const Form = require('../models/form');
const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
	const { auth } = req.cookies;
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

router.post('/save_input', verifyUser, (req, res) => {
	const userID = req.id;
	const { packs, price, quitDate } = req.body;

	const update = {
		user: userID,
		packs: packs,
		price: price,
		quitDate: quitDate,
	};

	Form.findOneAndUpdate(
		{ user: userID },
		update,
		{ upsert: true, new: true },
		(err, result) => {
			if (err) {
				console.log(err);
				res.status(500).json({
					error: 'Interal server error. Please try again',
				});
			}
			if (result) {
				console.log('Form saved');
				res.status(200).json({
					msg: 'Success',
				});
			}
		}
	);
});

router.get('/get_form', verifyUser, (req, res) => {
	const userID = req.id;

	Form.findOne({ user: userID }, (err, formData) => {
		if (err) {
			console.log('Error finding form data');
			res.status(500).json({ error: 'Error getting data.' });
		}
		if (!formData) {
			console.log('No form data found');
			res.status(200).json({ msg: 'No data found' });
		} else if (formData) {
			console.log('Form data found');
			res.status(200).json({
				formData: formData,
			});
		}
	});
});

module.exports = router;
