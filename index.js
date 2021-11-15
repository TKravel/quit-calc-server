require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const port = 3001;
const userRouter = require('./routes/users');
const goalRouter = require('./routes/goals');
const formRouter = require('./routes/form');

const app = express();

// Connect to DB
const mongoose = require('mongoose');
mongoose.connect(
	`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.ffprj.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`,
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
	console.log('Connected to quitCalcDB');
});

const corsOptions = {
	origin: true,
	'Access-Control-Allow-Credentials': true,
	credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/user', userRouter);
app.use('/goals', goalRouter);
app.use('/form', formRouter);

app.get('/', (req, res) => {
	res.send('Hello world');
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
