import WebSocket from "ws"

export default class PlayerOnGame{
    private players : any
    constructor(){
        this.players = {}
    }
    insertPlayer(id:string,socket:WebSocket){
        this.players[id] = {
            'id' : id,
            'socket' : socket,
            'status' : null
        }
    }
    getPlayers(){
        return this.players
    }
    removePlayer(id:string){
        this.players[id] = null
        delete this.players[id]
    }
    findPlayer(id:string){
        if(this.players[id]) return true
        else return false
    }
    getThatPlayer(id:string){
        return this.players[id]
    }
    setStatus(id:string,status:string){
        Object.defineProperty(this.players[id],'status',status)
    }
}