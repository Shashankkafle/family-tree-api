const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Person = sequelize.define('person', {
	id: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true,
	},
	firstName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	lastName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	birthDate: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	gender: {
		type: DataTypes.ENUM('male', 'female'),
		allowNull: false,
	},
	fatherId: {
		type: DataTypes.UUID,
		allowNull: true,
	},
	motherId: {
		type: DataTypes.UUID,
		allowNull: true,
	},
});

Person.associate = (models) => {
   // Self-referential relationship to establish parent-child hierarchy
   Person.belongsTo(models.Person, { as: 'Father', foreignKey: 'fatherId' });
   Person.belongsTo(models.Person, { as: 'Mother', foreignKey: 'motherId' });
};

module.exports = Person;
