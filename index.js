const express = require('express');
const app = express();
const port = 5000;

app.get('/test', (req, res) => {
	res.cookie('test', 'test cookie');
	res.send('Hello World!');
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
