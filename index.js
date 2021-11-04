const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const port = 3001;

const app = express();

const corsOptions = {
	origin: true,
	'Access-Control-Allow-Credentials': true,
	credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.post('/test', (req, res) => {
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Credentials', true);
	if (req.cookies) {
		console.log('cookie detected');
	}
	console.log('cookie: ' + JSON.stringify(req.cookies));
	res.cookie('test', 'test cookie');
	res.json({ cookie: 'check check' });
});

app.get('/', (req, res) => {
	res.send('Hello world');
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
