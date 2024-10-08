const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Person = sequelize.define(
	'person',
	{
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
		parentId: {
			type: DataTypes.UUID,
			allowNull: true,
		},
		partnerId: {
			type: DataTypes.UUID,
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



module.exports = Person;
