import { RandomMatchReq } from "./dataholder/randomreqplayer";

export default function playerLeftGame(
    randomMatchReq:RandomMatchReq,
    leftPlayer:string
    ){
        console.log(leftPlayer)
        const {randomReqPlayers} = randomMatchReq
        let trackPlayerIndex = 0 
        for(let player of randomReqPlayers){
            if(player.playerName === leftPlayer){
                randomMatchReq.removeAt(trackPlayerIndex)
                break
            }    
            trackPlayerIndex ++
        }
}
