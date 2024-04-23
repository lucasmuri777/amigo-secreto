import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type GetAllFilters = {id_event: number; id_group?: number};
export const getAll = async(filters: GetAllFilters) =>{
    try{
        return await prisma.eventPeople.findMany({where: filters});
    }catch(err){
        return false
    }
}

type GetOneFilters = {
    id_event: number;
    id_group?: number;
    id?: number;
    cpf?: string;
}
export const getOne = async(filters: GetOneFilters) =>{
    try{
        if(!filters.id && !filters.cpf) return false;
        
        return await prisma.eventPeople.findFirst({where: filters})
    }catch(err){return false}
}