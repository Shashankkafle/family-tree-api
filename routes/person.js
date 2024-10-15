const express = require('express');
const router = express.Router();
const { Person } = require('../models');
const { v4: uuidv4 } = require('uuid');
const personController = require('../controllers/personController');

// Add Child
router
	.route('/child')

	.post(personController.addChild);

// Add partner
router
	.route('/partner')

	.post(personController.addPartner);

// Get details of a person by ID
router.get('/:id', async (req, res) => {
	try {
		const person = await Person.findByPk(req.params.id);
		if (person) {
			res.status(200).json(person);
		} else {
			res.status(404).json({ message: 'Person not found' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Error fetching person', error });
	}
});

// Get all people
router
	.route('/')

	.get(personController.listAllPeople);

// Update person details
router
	.route('/:id')

	.put(personController.updatePerson);

// Delete a person
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Person.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(200).json({ message: 'Person deleted' });
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting person', error });
  }
});

module.exports = router;
