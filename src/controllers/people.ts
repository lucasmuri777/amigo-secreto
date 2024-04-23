import { RequestHandler } from 'express';
import * as people from '../services/people';

export const getAll: RequestHandler = async(req, res) =>{
    const {id_event, id_group} = req.params;

    const items = await people.getAll({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    })
    if(items) return res.json({people: items});

    res.json({error: 'Ocorreu um erro!'})
}

export const getPerson: RequestHandler = async(req, res) =>{
    const {id ,id_event, id_group} = req.params;

    const personItem = await people.getOne({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    })
    if(personItem) return res.json({person: personItem});

    res.json({error: 'Ocorreu um erro!'})
}