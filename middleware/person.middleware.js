const Joi = require('joi');

const basePersonSchema = {
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email().optional().allow(null, ''),
	profession: Joi.string().optional().allow(null, ''),
	permanentAddress: Joi.string().optional().allow(null, ''),
	currentAddress: Joi.string().optional().allow(null, ''),
	phoneNumber: Joi.string().optional().allow(null, ''),
	birthDate: Joi.date().required(),
	deathDate: Joi.date().optional().allow(null),
	gender: Joi.string().valid('male', 'female').required(),
	
};

const validateAddPartner = (req, res, next) => {
	const schema = Joi.object({
		...basePersonSchema,
        partnerId: Joi.number().integer().required(),
	});
	const { error } = schema.validate(req.body);
	return error ? res.status(400).json({ message: error.details[0].message }) : next();
};

const validateAddChild = (req, res, next) => {
    console.log('Validating add child request:', req.body);
	const schema = Joi.object({
		...basePersonSchema,
		parent1Id: Joi.number().integer().required(),
		parent2Id: Joi.number().integer().required(),
	});
	const { error } = schema.validate(req.body);
	return error ? res.status(400).json({ message: error.details[0].message }) : next();
};

const validateUpdatePerson = (req, res, next) => {
	const schema = Joi.object(
		basePersonSchema
	);
	const { error } = schema.validate(req.body);
	return error ? res.status(400).json({ message: error.details[0].message }) : next();
};

module.exports = {
	validateAddPartner,
	validateAddChild,
	validateUpdatePerson,
};
