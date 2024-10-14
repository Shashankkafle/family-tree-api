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
		parentId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		partnerId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		isRoot: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		validate: {
			// Custom validation to ensure at least one of parentId or partnerId is provided
			parentOrPartnerNeeded() {
				if (!this.parentId && !this.partnerId && !this.isRoot) {
					throw new Error(
						'At least one of parentId or partnerId must be provided'
					);
				}
			},
		},
	}
);

Person.hasOne(Person, {
	foreignKey: 'partnerId',
	as: 'partner',
});
Person.hasOne(Person, {
	foreignKey: 'parentId',
	as: 'parent',
});

module.exports = Person;
