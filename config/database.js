require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
		dialectOptions: {
			ssl: {
				require: true, // Enforce SSL
				rejectUnauthorized: false, // Skip certificate verification (optional; use if you're not using a self-signed cert)
			},
		},
		logging: false,
	}
);

module.exports = sequelize;
