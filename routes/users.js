const express = require('express');
const router = express.Router();
const User = require('../models/user');

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

module.exports = router;
