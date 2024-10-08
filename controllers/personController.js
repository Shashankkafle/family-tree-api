const { Op } = require('sequelize');
const { Person, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');
function buildFamilyTree(data) {
	// Step 1: Build a map of people by id
	const peopleMap = {};
	data.forEach((person) => {
		peopleMap[person.id] = {
			personDetails: person,
			children: [],
		};
	});

	// Then, build the tree structure by linking children to their parents
	data.forEach((person) => {
		console.log('person', person);
		if (person.parentid) {
			peopleMap[person.parentid].children.push(person);
		}
	});

	return peopleMap[data[0].id];
}
async function listAllPeople(req, res, next) {
	try {
		const people = await sequelize.query(
			'SELECT p.id AS id, p."firstName" AS firstName, p."lastName" AS lastName, p."birthDate" AS birthDate, p."gender" AS gender, p."parentId" AS parentId, p."partnerId" AS partnerId, p."isRoot" AS isRoot, p."createdAt" AS createdAt, p."updatedAt" AS updatedAt, partner."firstName" AS partnerFirstName, partner."lastName" AS partnerLastName, partner."birthDate" AS partnerBirthDate, partner."gender" AS partnerGender, partner."parentId" AS partnerParentId, partner."partnerId" AS partnerPartnerId, partner."isRoot" AS partnerIsRoot, partner."createdAt" AS partnerCreatedAt, partner."updatedAt" AS partnerUpdatedAt FROM people p LEFT JOIN people partner ON p."partnerId" = partner.id WHERE  p."parentId" IS NOT NULL OR p."isRoot" = TRUE;'
		);
		const familyTree = buildFamilyTree(people[0]);
		console.log('\n\n\nfamilytree', JSON.stringify(familyTree));
		res.status(201).json(familyTree);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching all people', error });
	}
}
module.exports = { listAllPeople };
