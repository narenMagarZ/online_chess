import WebSocket from 'ws'
class PlayerOnMatch{
    private player : any
    constructor(){
        this.player = {}
    }
    insert(
        matchId:string,
        player1:string,
        player2:string,
        socket1:WebSocket,
        socket2:WebSocket){
        const playerInfo = {
            player1 : {
                'id' : player1,
                'socket' : socket1
            },
            player2 : {
                'id' : player2,
                'socket' : socket2
            }
        }
        this.player[matchId] = playerInfo
    }
    remove(matchId:string){
        const removedUser = this.player[matchId]
        if(removedUser){
            this.player[matchId] = null
            delete this.player[matchId]
        }  
        return removedUser
    }
    all(){
        return this.player
    }

}


export const playerOnMatch = new PlayerOnMatch()