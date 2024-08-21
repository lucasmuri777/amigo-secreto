import { RequestHandler } from "express";
import * as events from "../services/events";
import * as people from "../services/people";
import { z } from "zod";

export const getAll: RequestHandler = async(req, res) =>{
    const items = await events.getAll();
    if(items) return res.json({events: items});

    res.json({error: "Algo deu errado"})

}

export const getEvent: RequestHandler = async(req, res) =>{
    const {id} = req.params;
    const eventItem = await events.getOne(parseInt(id));
    if(eventItem) return res.json({event: eventItem});

    res.json({error: "Algo deu errado"})
}

export const addEvent: RequestHandler = async(req, res) =>{
    const addEventSchema = z.object({
        title: z.string(),
        description: z.string(),
        grouped: z.boolean(),
    })

    const body = addEventSchema.safeParse(req.body);
    if(!body.success) return res.json({error: "Dados inválidos"});

    const newEvent = await events.add(body.data);
    if(newEvent) return res.status(201).json({event: newEvent});

    res.json({error: "Algo deu errado"})
}

export const updateEvent: RequestHandler = async(req, res) =>{
    const {id} = req.params;

    //criando o schema para o zod verificar (como é uma edicao todos devem ser opcionais)
    const updateEventSchema = z.object({
        status: z.boolean().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        grouped: z.boolean().optional(),
    })
    //zod validando
    const body = updateEventSchema.safeParse(req.body);
    if(!body.success) return res.json({error: "Dados inválidos"});

    const updateEvent = await events.update(parseInt(id), body.data);
    if(updateEvent) {
        if(updateEvent.status){
            //TODO: Fazer o sorteio
            const result = await events.doMatches(parseInt(id));
            if(!result){
                return res.json({error: "Grupos impossiveis de sortear"});
            }
        }else{
            //TODO: Limpar o sorteio
            await people.update({ id_event: parseInt(id) }, {matched: ''})
        }

       return res.json({event: updateEvent});
    }

    res.json({error: "Algo deu errado"});
}

export const deleteEvent: RequestHandler = async(req, res) =>{
    const {id} = req.params;

    const deletedEvent = await events.remove(parseInt(id));
    if(deletedEvent) return res.json({event: deletedEvent, deleted: true});

    res.json({error: "Algo deu errado"});
}