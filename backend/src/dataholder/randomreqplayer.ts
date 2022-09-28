
// convert this class to accept and store all the players 
export class RandomMatchReq{
    private players : any[]
    private top : number
    constructor(){
        this.players = []
        this.top = -1
    }

    pop(){
        if(this.top >=0 ){
            const poppedElem = this.players.splice(0,1)
            this.top -- 
            return poppedElem
        } else {
            return null
        }
    }
    push(player:any){
        this.players.push(player)
        this.top ++
    }
    get randomReqPlayers(){
        return this.players
    }
    removeAt(index:number){
        if(this.top >= 0){
            this.top --
            this.players.splice(index,1)
        }
    }
}
