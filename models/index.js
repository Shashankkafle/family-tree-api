const sequelize = require('../config/database');
const Person = require('./person');

const initDb = async () => {
  await sequelize.sync({ force: false }); // Creates tables if they don't exist
  console.log('Database synchronized');
};

module.exports = { sequelize, initDb, Person };
