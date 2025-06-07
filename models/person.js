const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Person = sequelize.define(
	'person',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		firstName: { type: DataTypes.STRING, allowNull: false },
		lastName: { type: DataTypes.STRING, allowNull: false },
		email: { type: DataTypes.STRING, allowNull: true },
		profession: { type: DataTypes.STRING, allowNull: true },
		permanentAddress: { type: DataTypes.STRING, allowNull: true },
		currentAddress: { type: DataTypes.STRING, allowNull: true },
		phoneNumber: { type: DataTypes.STRING, allowNull: true },
		image: { type: DataTypes.STRING, allowNull: true },
		birthDate: { type: DataTypes.DATE, allowNull: false },
		deathDate: { type: DataTypes.DATE, allowNull: true },
		gender: {
			type: DataTypes.ENUM('male', 'female'),
			allowNull: false,
		},
		isRoot: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		// validate: {
		// 	parentOrPartnerNeeded() {
		// 		console.log("form validator", this.parentId, this.partnerId, this.isRoot);
		// 		if (!this.parentId && !this.partnerId && !this.isRoot) {
		// 			throw new Error(
		// 				'At least one of parentId or partnerId must be provided'
		// 			);
		// 		}
		// 	},
		// },
	}
);

// Relationships
//Many to many relationships are made to keep track of which parent the child belongs to in case of multiple partners.
//Many to many reletionships could be avided by some clever implementation like assigning the partner as parent instead of direct discendant but it would complicate the system and make it rigid.  

Person.belongsToMany(Person, {
	through: 'PersonParents',
	as: 'parents',
  });
  
  
  Person.belongsToMany(Person, {
	as: 'partners',
	through: 'PersonPartners',
  });

module.exports = Person;
