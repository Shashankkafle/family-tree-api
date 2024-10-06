const express = require('express');
const bodyParser = require('body-parser');
const { initDb, Person } = require('./models');
const app = express();

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
