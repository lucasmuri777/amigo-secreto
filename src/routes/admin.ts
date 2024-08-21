import { Router } from "express";
import * as auth from "../controllers/auth";
import * as events from "../controllers/events";
import * as groups from "../controllers/groups";
import * as people from "../controllers/people";
const router = Router();


router.get('/ping', auth.validate, (req, res) => {
    res.json({
        pong: true
    })
})
router.get('/login', auth.login)

//rota de listar todos os eventos
router.get('/events', auth.validate, events.getAll);
//rota de listar um evento pelo id
router.get('/events/:id', auth.validate, events.getEvent);
//rota de add um evento novo
router.post('/events', auth.validate, events.addEvent);
//rota de atualizar um evento
router.put('/events/:id', auth.validate, events.updateEvent);
//rota de deletar evento
router.delete('/events/:id', auth.validate, events.deleteEvent);


//listar todos os grupos
router.get('/events/:id_event/groups', auth.validate, groups.getAll);
//pegar so um grupo
router.get('/events/:id_event/groups/:id', auth.validate, groups.getGroup);
//acionar novo grupo
router.post('/events/:id_event/groups', auth.validate, groups.addGroup);
//atualizar grupo
router.put('/events/:id_event/groups/:id', auth.validate, groups.updateGroup);
//deletar grupo
router.delete('/events/:id_event/groups/:id', auth.validate, groups.deleteGroup);


//pegar todas pessoas de determinado grupo que fazem parte de determinado evento
router.get('/events/:id_event/groups/:id_group/people', auth.validate, people.getAll)
//pegando uma pessoa so
router.get('/events/:id_event/groups/:id_group/people/:id', auth.validate, people.getPerson);
//adicionando uma pessoa
router.post('/events/:id_event/groups/:id_group/people', auth.validate, people.addPerson);
//mudar dados de uma pessoa
router.put('/events/:id_event/groups/:id_group/people/:id', auth.validate, people.updatePerson);
//Deletar uma pessoa
router.delete('/events/:id_event/groups/:id_group/people/:id', auth.validate, people.deletePerson);
export default router;

