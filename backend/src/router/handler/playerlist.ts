import {Request,Response} from 'express'
import {prevClients} from '../../wsserver'
export default function playerList(req:Request,res:Response){
    res.json({
        clients:prevClients
    })
}

