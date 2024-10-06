const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Person = sequelize.define('Person', {
   firstName: {
     type: DataTypes.STRING,
     allowNull: false
   },
   lastName: {
     type: DataTypes.STRING,
     allowNull: false
   },
   birthDate: {
     type: DataTypes.DATE,
     allowNull: false
   },
   gender: {
     type: DataTypes.ENUM('male', 'female'),
     allowNull: false
   },
   // Additional fields like place of birth, biography, etc.
});

Person.associate = (models) => {
   // Self-referential relationship to establish parent-child hierarchy
   Person.belongsTo(models.Person, { as: 'Father', foreignKey: 'fatherId' });
   Person.belongsTo(models.Person, { as: 'Mother', foreignKey: 'motherId' });
};

module.exports = Person;
