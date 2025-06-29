const { updateGoogleSheet } = require('../services/googleSheets');
const { uploadImage } = require('../services/imageUpload');
const { fetchPersonPartners, fetchAllPeople, fetchPersonById, cratePartner, createChild } = require('../repository/person.repo');


async function listAllPeople(req, res, next) {
	try {
		const people = await fetchAllPeople()
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
		const partner = await fetchPersonById(personData.partnerId);
		if (!partner) {
			return res.status(400).json({ message: 'Partner not found' });
		}
		const person = await cratePartner(personData, partner);
		await updateGoogleSheet(person.dataValues);
		await t.commit(); 
		res.status(201).json(person);
	} catch (error) {
		await t.rollback();
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
		  //NOTE: may make sense to check for parents and their relationships in a validation middleware later
		  const parent1 = await fetchPersonById(personData.parent1Id);
		  const parent2 = await fetchPersonById(personData.parent2Id);
		  if (!parent1 || !parent2) {
			  return res.status(400).json({ message: 'Parents of the child not found' });
		  }	
		  const person = await createChild(personData);	
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
		const [updated] = await updatePerson(req.params.id, personData);
		if (updated) {
			const updatedPerson = await fetchPersonById(req.params.id);
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
		const person = await fetchPersonById(id);
		//may be a good idea to move this validation to a middleware
		if(!person) {
			return res.status(404).json({ message: 'Person not found' });
		}
		const deleted = await person.destroy();
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
async function getPersonPartners(req, res, next) {
	try {
		const personId = req.params.id;
		const partners = await fetchPersonPartners(personId);
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
	getPersonPartners
};
