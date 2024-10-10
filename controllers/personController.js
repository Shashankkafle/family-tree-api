const { Op, where } = require('sequelize');
const { Person, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');

async function listAllPeople(req, res, next) {
	try {
		const people = await Person.findAll({
			where: {
				[Op.or]: [{ parentId: { [Op.ne]: null } }, { isRoot: true }],
			},
			include: [
				{
					model: Person,
					as: 'partner',
				},
				{
					model: Person,
					as: 'parent',
					include: {
						model: Person,
						as: 'partner',
					},
				},
			],
		});
		res.status(201).json(people);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching all people', error });
	}
}
async function addPartner(req, res, next) {
	try {
		const persondata = req.body;
		persondata.id = uuidv4();
		const person = await Person.create(req.body);
		await Person.update(
			{ partnerId: persondata.id },
			{ where: { id: persondata.partnerId } }
		);
		res.status(201).json(person);
	} catch (error) {
		res.status(500).json({ message: 'Error creating partner', error });
	}
}
module.exports = { listAllPeople };
