const express = require('express');
const bodyParser = require('body-parser');
const { initDb } = require('./models');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initDb();  // Initialize the DB when server starts

// Routes
const personRoutes = require('./routes/person');
app.use('/person', personRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
