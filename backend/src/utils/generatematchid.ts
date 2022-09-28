import {v4 as uuidv4} from 'uuid'

export default function generateMatchId(){
    return uuidv4().split('-').join('')
}