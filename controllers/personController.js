const { Op, where } = require('sequelize');
const { Person, PersonPartners,sequelize } = require('../models');
const { updateGoogleSheet } = require('../services/googleSheets');
const { uploadImage } = require('../services/imageUpload');
async function linkPartners(personA, personB) {
	//thise are sequelize mixins read more about them here https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
	await personA.addPartner(personB);
	await personB.addPartner(personA);
}
async function linkParents(child, parentA,parentB) {
	//thise are sequelize mixins read more about them here https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
	await child.addParents([parentA, parentB]);
}


async function listAllPeople(req, res, next) {
	try {
		const people = await Person.findAll({
				include:[
						{
							model:Person, as:'partners' , attributes:['id']
						},
						{
							model:Person, as:'parents' ,attributes:['id']
						}
					]
			});
		res.status(200).json(people);
	} catch (error) {
		next(error);
	}
}
async function addPartner(req, res, next) {
	try {
		const personData = req.body;
		if (req?.files?.image) {
			const imageUrl = await uploadImage(req?.files?.image.data);
			personData.image = imageUrl;
		}
		const partner = await Person.findByPk(personData.partnerId);
		if (!partner) {
			return res.status(400).json({ message: 'Partner not found' });
		}
		const person = await Person.create(personData);
		await linkPartners(person, partner);
		await updateGoogleSheet(person.dataValues);
		res.status(201).json(person);
	} catch (error) {
		next(error);
	}
}
async function addChild(req, res, next) {
	try {
		const personData = req.body;
		if (req?.files?.image) {
			const imageUrl = await uploadImage(req?.files?.image.data);
			personData.image = imageUrl;
		}
		const person = await Person.create(personData);
		await updateGoogleSheet(person.dataValues);
		res.status(201).json(person);
	} catch (error) {
		next(error);
	}
}
async function updatePerson(req, res, next) {
	try {
		const personData = req.body;
		if (req?.files?.image) {
			const imageUrl = await uploadImage(req?.files?.image.data);
			personData.image = imageUrl;
		}
		const [updated] = await Person.update(personData, {
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
async function gerPersonPartners(req, res, next) {
	try {
		console.log("from controller")
		const personId = req.params.id;
		const person = await Person.findByPk(personId);
		const partners = await person.getPartners();
		res.status(201).json([...partners]);
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
	gerPersonPartners
};
