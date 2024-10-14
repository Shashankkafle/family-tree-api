const { Op, where } = require('sequelize');
const { Person, sequelize } = require('../models');
const { updateGoogleSheet } = require('../services/googleSheets');

async function listAllPeople(req, res, next) {
	try {
		// const people = await Person.findAll({
		// 	where: {
		// 		[Op.or]: [{ parentId: { [Op.ne]: null } }, { isRoot: true }],
		// 	},
		// 	include: [
		// 		{
		// 			model: Person,
		// 			as: 'partner',
		// 		},
		// 		{
		// 			model: Person,
		// 			as: 'parent',
		// 			include: {
		// 				model: Person,
		// 				as: 'partner',
		// 			},
		// 		},
		// 	],
		// });
		const people = await Person.findAll();
		res.status(201).json(people);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching all people', error });
	}
}
async function addPartner(req, res, next) {
	try {
		const persondata = req.body;
		const person = await Person.create(persondata);
		await Person.update(
			{ partnerId: person.dataValues.id },
			{ where: { id: persondata.partnerId } }
		);
		await updateGoogleSheet(person.dataValues);
		res.status(201).json(person);
	} catch (error) {
		res.status(500).json({ message: 'Error creating partner', error });
	}
}
async function addChild(req, res, next) {
	try {
		const persondata = req.body;
		const person = await Person.create(persondata);
		await updateGoogleSheet(person.dataValues);
		res.status(201).json(person);
	} catch (error) {
		res.status(500).json({ message: 'Error creating partner', error });
	}
}
module.exports = { listAllPeople, addPartner, addChild };
