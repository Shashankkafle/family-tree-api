const express = require('express');
const router = express.Router();
const { Person } = require('../models');
const personController = require('../controllers/personController');
const { validateUpdatePerson, validateAddChild, validateAddPartner } = require('../validators/person');
const { fetchPersonById } = require('../repository/person.repo');
const { checkPartnership } = require('../middleware/person.middleware');

// Get partners of a person
router.get('/partner/:id', personController.getPersonPartners);

// Add partner
router.post('/partner', validateAddPartner, personController.addPartner);
// Add child
router.post('/child', validateAddChild,checkPartnership, personController.addChild);

// Get all people
router.get('/', personController.listAllPeople);

// Get details of a person by ID
router.get('/:id', async (req, res,next) => {
	try {
		const person = await fetchPersonById(req.params.id);
		if (person) {
			res.status(200).json(person);
		} else {
			res.status(404).json({ message: 'Person not found' });
		}
	} catch (error) {
		next(error);
	}
});

// Update person details
router.put('/:id', validateUpdatePerson, personController.updatePerson);

// Delete a person
router.delete('/:id',  personController.deletePerson);

module.exports = router;
