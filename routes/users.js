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
				res.status(401).json({ msg: 'denied' });
			}
		});
		next();
	} else {
		return res.status(401).json({ msg: 'denied' });
	}
	next();
};

router.get('/verify_user', verifyToken, (req, res) => {
	res.status(200).json({ msg: 'granted' });
});

router.post('/login', (req, res) => {
	const { username, password } = req.body;

	User.findOne({ user: username }, (err, foundUser) => {
		if (err) {
			console.log('Mongo err: ' + err);
			res.status(500).json({ error: 'Database error' });
		} else if (!foundUser) {
			res.status(401).json({ error: 'Username or password incorrect' });
		} else {
			const pwHash = foundUser.password;

			bcrypt.compare(password, pwHash, (err, result) => {
				if (err) {
					res.status(500).json({ error: 'Internal server error' });
				} else if (!result) {
					res.status(401).json({
						error: 'Username or password incorrect',
					});
				} else if (result) {
					const userID = foundUser._id;

					const token = jwt.sign(
						{ id: userID },
						process.env.JWT_SECRET
					);

					res.cookie('auth', token).json({ msg: 'granted' });
				}
			});
		}
	});
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
			res.status(401).json({ error: 'Username taken' });
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
						newUser.save((err, createdUser) => {
							if (err) {
								res.status(500).json({
									error: 'Error saving user',
								});
							} else {
								const userID = createdUser._id;

								const token = jwt.sign(
									{ id: userID },
									process.env.JWT_SECRET
								);
								res.cookie('auth', token).status(200).json({
									msg: 'granted',
								});
							}
						});
					}
				});
			} catch (err) {
				console.log(err);
				res.status(500).json({ error: 'Internal server error' });
			}
		}
	});
});

module.exports = router;
