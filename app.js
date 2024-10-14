const express = require('express');
const bodyParser = require('body-parser');
const { initDb } = require('./models');
const cors = require('cors');
const personRoutes = require('./routes/person');
const googleRoutes = require('./routes/google');
const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initDb(); // Initialize the DB when server starts

// Routes
app.use('/person', personRoutes);
app.use('/oauth2callback', googleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
