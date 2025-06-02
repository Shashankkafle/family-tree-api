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

// Relationships
Person.belongsTo(Person, { foreignKey: 'partnerId', as: 'partner' });
Person.belongsTo(Person, { foreignKey: 'parentId', as: 'parent' });
Person.hasMany(Person, { foreignKey: 'parentId', as: 'children' });

module.exports = Person;
