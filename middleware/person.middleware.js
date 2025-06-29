import { getPersonPartners } from "../controllers/personController";
import { Person, sequelize } from "../models";
import { fetchPersonPartners } from "../repository/person.repo";

const checkPartnership = (req, res, next) => {
    const person1 = req.params.id;
    const person2 = req.params.id;
    const partner = fetchPersonPartners(person1)
}