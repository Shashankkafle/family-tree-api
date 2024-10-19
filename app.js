const express = require('express');
const { initDb } = require('./models');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const createHttpError = require('http-errors');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const personRoutes = require('./routes/person');
const googleRoutes = require('./routes/google');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initDb(); // Initialize the DB when server starts
app.use(logger('dev'));

// parse body params and attached them to req.body
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

//enable fileupload
app.use(fileUpload());
//add id to each request
app.use((req, res, next) => {
	req.id = uuidv4();
	next();
});

// Routes
app.use('/person', personRoutes);
app.use('/oauth2callback', googleRoutes);

app.use((req, res, next) => {
	next(new createHttpError.NotFound());
});

const errorHandler = (err, req, res, next) => {
	console.log(err);
	res.status(err.statusCode || 500);
	res.send({
		status: err.statusCode || 500,
		success: false,
		error: err.error || err.message,
		stack: process.env.NODE_ENV === 'local' ? err : '',
	});
};

app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
