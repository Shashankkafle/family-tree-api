const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
	try {
		console.log('req body', req.body);
	} catch (error) {}
});
module.exports = router;
