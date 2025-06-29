const { Person } = require("../models");

async function linkPartners(personA, personB,transaction) {
	//thise are sequelize mixins read more about them here https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
	await personA.addPartner(personB,{transaction});
	await personB.addPartner(personA,{transaction});
}
async function fetchPersonPartners(personId){
    try{
        const person = await Person.findByPk(personId);
        const partners = await person.getPartners();
        return partners

    }catch(error){
        throw new Error(`Error fetching partners for person with ID ${personId}: ${error.message}`);
    }
}
async function fetchPersonById(personId){
    try{
        const person = await Person.findByPk(personId);
        return person;
    }catch{
        throw new Error(`Error fetching person with ID ${personId}: ${error.message}`);
    }
}
async function fetchAllPeople(){
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
        return people;
	} catch (error) {
		throw new Error(`Error fetching all people: ${error.message}`);
	}
}
async function cratePartner(personData,partner) {
    try {
        const t = await sequelize.transaction();
		const person = await Person.create(personData,{transaction: t});
		await linkPartners(person, partner,t);
        await t.commit();
        return person;
    } catch (error) {
        await t.rollback();
        throw new Error(`Error creating partner: ${error.message}`);
    }
    
}
async function createChild(personData) {
    try {    
		const person = await Person.create(personData,);
        return person;
    } catch (error) {
        throw new Error(`Error creating child: ${error.message}`);
    }
    
}
async function updatePerson(id,personData) {
    try {
        return await Person.update(personData, {
            where: { id },
        });
    } catch (error) {
        throw new Error(`Error updating person with ID ${id}: ${error.message}`);
    }
   
}
module.exports = {
    fetchPersonPartners,
    fetchPersonById,
    fetchAllPeople,
    cratePartner,
    createChild,
    updatePerson
}