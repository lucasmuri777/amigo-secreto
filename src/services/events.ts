import { PrismaClient, Prisma } from '@prisma/client';
import * as people from './people';
import * as groups from './groups';
import * as match from '../utils/match';

const prisma = new PrismaClient();

export const getAll = async() =>{
    try{
        return await prisma.event.findMany();
    }catch(err) { return false }
}

export const getOne = async(id: number) =>{
    try{
       return await prisma.event.findFirst({where: { id }});
    }catch(err) { return false }
}

type EventsCreateData = Prisma.Args<typeof prisma.event, 'create'>['data'];

export const add = async(data: EventsCreateData)=>{
    try{
        return await prisma.event.create({ data });
    }catch(err){
        return false;
    }
}

type EventUpdateData = Prisma.Args<typeof prisma.event, 'update'>['data'];

export const update = async(id: number, data: EventUpdateData) =>{
    try{
        return await prisma.event.update({ where: { id }, data });
    }catch(err) {
        return false;
    }
}

export const remove = async(id: number) =>{
    try{
        return await prisma.event.delete({where: {id}});
    }catch(err) { return false }
}

 /*
        -Grupo 1 (id: 5)
        --Lucas 1
        --Pedro 2 
        --yasmin 4

        -Grupo 3 (id: 41)
        --Kaue 5
        --Duda 8
        

        -Grupo 2 (id: 40)
        --Caua 7
    */

export const doMatches = async(id: number): Promise<boolean> => {
    const eventItem = await prisma.event.findFirst({
        where: { id },
        select:{
            grouped: true,
        }
    });

    if(eventItem){
        const peopleList = await people.getAll({ id_event: id });

        if(peopleList){
            let sortedList: {id: number, match: number}[] = [];
            let sortable: number[] = [];

            let attempts = 0;
            let maxAttempts = peopleList.length;
            let keepTrying = true;

            while(keepTrying && attempts < maxAttempts){
                keepTrying = false;
                attempts++;
                sortedList = [];
                sortable = peopleList.map((p) => p.id);
                
                for(let i in peopleList){
                    let sortableFiltered: number[] = sortable;
                    if(eventItem.grouped){
                        sortableFiltered = sortable.filter(sortableItem=>{
                            let sortablePerson = peopleList.find(item => item.id === sortableItem);
                            return peopleList[i].id_group !== sortablePerson?.id_group;
                        })

                    }

                    if(sortableFiltered.length === 0 || 
                        (sortableFiltered.length === 1 && 
                            peopleList[i].id === sortableFiltered[0]
                        )){
                        keepTrying = true;
                    }else{
                        let sortabledIndex = Math.floor(Math.random() * sortableFiltered.length);
                        while(sortableFiltered[sortabledIndex] === peopleList[i].id){
                            sortabledIndex = Math.floor(Math.random() * sortableFiltered.length);
                        }

                        sortedList.push({
                            id: peopleList[i].id,
                            match: sortableFiltered[sortabledIndex],
                        });

                        sortable = sortable.filter(item => item !== sortableFiltered[sortabledIndex]);
                    }
                }
            }

            console.log(`ATTEMPTS: ${attempts}`);
            console.log(`MAX ATTEMPTS: ${maxAttempts}`);
            console.log(sortedList);

            
            if(attempts < maxAttempts){
             
                for(let i in sortedList){
                    await people.update({
                        id: sortedList[i].id,
                        id_event: id,
                    }, { matched: match.encryptMatch(sortedList[i].match) }); //TODO: Criar encryptMatch()
                }
                return true; 
            }
            
        }
    }


    return false; //temporario
}