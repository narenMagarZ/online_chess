import { RandomMatchReq } from "./dataholder/randomreqplayer"

function cancelRandomPlayMatching(
    randomMatchReq:RandomMatchReq,
    playerId:string){
    const {randomReqPlayers} = randomMatchReq
    let playerIndex = 0
    for(let reqPlayer of randomReqPlayers){
        if(reqPlayer.playerName === playerId){
            randomMatchReq.removeAt(playerIndex)
            break
        }   
        playerIndex ++
    }
}
export default cancelRandomPlayMatching