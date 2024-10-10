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

// Get all people
router
	.route('/')

	.get(personController.listAllPeople);


// Get details of a person by ID
router.get('/:id', async (req, res) => {
  try {
    const person = await Person.findByPk(req.params.id, {
      include: [{ model: Person, as: 'Father' }, { model: Person, as: 'Mother' }]
    });
    if (person) {
      res.status(200).json(person);
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching person', error });
  }
});

// Update person details
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Person.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedPerson = await Person.findByPk(req.params.id);
      res.status(200).json(updatedPerson);
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating person', error });
  }
});

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
