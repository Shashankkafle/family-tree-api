const { Op, where } = require('sequelize');
const { Person, sequelize } = require('../models');
const { updateGoogleSheet } = require('../services/googleSheets');

async function listAllPeople(req, res, next) {
	try {
		console.log('listing people');
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
		res.status(200).json(people);
	} catch (error) {
		next(error);
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
		next(error);
	}
}
async function addChild(req, res, next) {
	try {
		const persondata = req.body;
		const person = await Person.create(persondata);
		await updateGoogleSheet(person.dataValues);
		res.status(201).json(person);
	} catch (error) {
		next(error);
	}
}
async function updatePerson(req, res, next) {
	try {
		const [updated] = await Person.update(req.body, {
			where: { id: req.params.id },
		});
		if (updated) {
			const updatedPerson = await Person.findByPk(req.params.id);
			await updateGoogleSheet(updatedPerson.dataValues);
			res.status(200).json(updatedPerson);
		} else {
			res.status(404).json({ message: 'Person not found' });
		}
	} catch (error) {
		next(error);
	}
}
async function deletePerson(req, res, next) {
	try {
		const id = req.params.id;
		const deleted = await Person.destroy({
			where: { id },
		});
		await updateGoogleSheet({ id });
		if (deleted) {
			res.status(200).json({ message: 'Person deleted' });
		} else {
			res.status(404).json({ message: 'Person not found' });
		}
	} catch (error) {
		next(error);
	}
}
module.exports = {
	listAllPeople,
	addPartner,
	addChild,
	updatePerson,
	deletePerson,
};
