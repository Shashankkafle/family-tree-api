import { fetchPersonPartners } from "../repository/person.repo.js";


export const checkPartnership = async (req, res, next) => {
    const person1 = req.body.parent1Id;
    const person2 = req.body.parent2Id;
    const partners = await fetchPersonPartners(person1)
    if (!partners) return res.status(404).json({ message: `No partner found for person with id ${person1}` });
    const partner = partners.find((partner) => {
        // return partner.dataValues.id === Number(person2)
        if(partner.dataValues.id === Number(person2)){
        return partner
        }
    });
    console.log("partner",partner);
    if(!partner) return res.status(400).json({ message: `Person with id ${person2} is not a partner of person with id ${person1}` });
    next()

}