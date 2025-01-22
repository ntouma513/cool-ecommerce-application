const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection'); // Import Sequelize connection
require('dotenv').config(); // Ensure environment variables are loaded

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Sync Sequelize models to the database and start the server
sequelize.sync({ force: false }).then(() => { // Use force: true for re-creating tables during development
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});
