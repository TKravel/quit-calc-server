const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const { auth } = req.cookies;
	if (auth) {
		jwt.verify(auth, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				console.log(err);
			} else if (decoded === false) {
				res.json({ msg: 'denied' });
			}
		});
		next();
	} else {
		res.json({ msg: 'denied' }).send();
	}
	next();
};

router.get('/verify_user', verifyToken, (req, res) => {
	res.json({ msg: 'granted' });
});

router.post('/login', (req, res) => {
	const data = req.body;
	console.log(data.username, data.password);
	if (req.cookies) {
		console.log('cookie detected');
	}
	console.log('cookie: ' + JSON.stringify(req.cookies));
	res.cookie('test', 'test cookie');
	res.json({ cookie: 'check check' });
});

router.get('/logout', (req, res) => {
	res.clearCookie('auth').json({ msg: 'logged out' });
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
