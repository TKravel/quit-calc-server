const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/getQuote', (req, res) => {
	fetch('https://inspiring-quotes.p.rapidapi.com/random', {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'x-rapidapi-host': 'inspiring-quotes.p.rapidapi.com',
			'x-rapidapi-key': process.env.QUOTE_KEY,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			if (err) {
				console.log(err);
			}
		});
});

module.exports = router;
