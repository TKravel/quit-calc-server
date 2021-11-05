const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

router.post('/test', (req, res) => {
	const data = req.body;
	console.log(data.username, data.password);
	if (req.cookies) {
		console.log('cookie detected');
	}
	console.log('cookie: ' + JSON.stringify(req.cookies));
	res.cookie('test', 'test cookie');
	res.json({ cookie: 'check check' });
});

router.post('/register', (req, res) => {
	const { username, email, password } = req.body;
	console.log(username, email, password);

	User.findOne({ user: username }, (err, result) => {
		if (err) {
			console.log('err: ' + err);
		} else if (result) {
			res.json({ error: 'Username taken' });
		} else {
			try {
				bcrypt.hash(password, saltRounds, (err, hash) => {
					if (err) {
						console.log('hash err: ' + err);
					} else {
						const newUser = new User({
							user: username,
							email: email,
							password: hash,
						});
						newUser.save();
						const token = jwt.sign(
							{ user: username },
							process.env.JWT_SECRET
						);
						res.cookie('auth', token).json({ msg: 'success' });
					}
				});
			} catch (err) {
				console.log(err);
			}
		}
	});
});

module.exports = router;
