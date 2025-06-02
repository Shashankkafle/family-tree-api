const { Op, where } = require('sequelize');
const { Person, sequelize } = require('../models');
const { updateGoogleSheet } = require('../services/googleSheets');
const { uploadImage } = require('../services/imageUpload');
function buildNestedTree(rows) {
	const idMap = new Map();
	const roots = [];
  
	for (const row of rows) {
	  row.children = [];
	  idMap.set(row.id, row);
	}
  
	for (const row of rows) {
	  if (!row.isRoot) {
		const parent = idMap.get(row.parentId);
		const partner = idMap.get(row.partnerId)
		if (parent) {
			if (partner) row.partner = partner
			const parentPartner = idMap.get(parent.partnerId)
			if(!parentPartner){
					// make some kind of log signalling somwthing wrong with the data saying apartenr must exist for a child to exist 
					console.log("child without  partner detected for parent",parent.id)
					parent.children.push(row)
			}
			else{
				//child added to partner to make sure that we know which child is fro which partner in case of multiple partners
			parentPartner.children.push(row);

			}
		}
		
	  } else {
		roots.push(row);
	  }
	}
  
	return roots;
  }
  
  

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
async function listAsTree(req, res, next) {
	try {

		const [results, metadata] = await sequelize.query(`
 WITH RECURSIVE tree AS (
  SELECT
id, "firstName", "parentId", "isRoot", "partnerId"
  FROM
    people
  WHERE
    "isRoot" = True
  UNION
  SELECT
    p.id, p."firstName", p."parentId", p."isRoot" , p."partnerId"
  FROM
    people p
    INNER JOIN tree t ON (t.id = p."parentId" OR t.id = p."partnerId")
)
SELECT * FROM tree;`);
console.log("results",results)
const familyTree = buildNestedTree(results)
res.status(200).json(familyTree);
	} catch (error) {
		console.log("error form controller",error)
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
		const person = await Person.create(personData);
		await Person.update(
			{ partnerId: person.dataValues.id },
			{ where: { id: personData.partnerId } }
		);
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
module.exports = {
	listAllPeople,
	addPartner,
	addChild,
	updatePerson,
	deletePerson,
	listAsTree
};
