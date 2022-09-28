import WebSocket from "ws"
import { RandomMatchReq } from "./dataholder/randomreqplayer"
import { playerOnMatch } from "./dataholder/playeronmatch"
import {v4 as uuidv4} from 'uuid'
function randomPlayMatching(
    randomMatchReq:RandomMatchReq,
    randomPlayerId:number,
    socket:WebSocket,
    isNewRandomPlayMatchingReqExist:any[]
    ){
    const maxWaitForMatch = 10 * 1000
    let waitTick = 0
    let isWait = false
    function checkForRandomPlayer():boolean{
        let isRandomPlayerMatched = false
        let {randomReqPlayers} = randomMatchReq
        for(let randomPlayer of randomReqPlayers){
            if(randomPlayerId !== randomPlayer.playerId){
                function generateMatchId(){
                    return uuidv4().split('-').join('')
                }
                const matchId = generateMatchId()
                const firstTurnPlayer = randomReqPlayers[0]?.playerName
                const secondTurnPlayer = randomReqPlayers[1]?.playerName
                randomReqPlayers[0]?.socket.send(JSON.stringify({
                    'type' : 'STARTRANDOMMATCH',
                    'data' : {
                        'wait' : false,
                        'startMatch' : true,
                        'opponent' : secondTurnPlayer,
                        'you' : firstTurnPlayer,
                        'matchId' : matchId,
                        'movementTurn' : firstTurnPlayer
                    }
                }))
                randomReqPlayers[1]?.socket.send(JSON.stringify({
                    'type' : 'STARTRANDOMMATCH',
                    'data' : {
                        'wait' : false,
                        'startMatch' : true,
                        'opponent' : firstTurnPlayer,
                        'you' : secondTurnPlayer,
                        'matchId' : matchId,
                        'firstTurn' : firstTurnPlayer
                    }
                }))
                playerOnMatch.insert(
                    matchId,
                    randomReqPlayers[0]?.playerName,
                    randomReqPlayers[1]?.playerName,
                    randomReqPlayers[0]?.socket,
                    randomReqPlayers[1]?.socket
                    )
                isRandomPlayerMatched = true
                isNewRandomPlayMatchingReqExist[0] = true
                randomMatchReq.pop()
                randomMatchReq.pop()
                break
            } else {
                console.log('waiting for another player to join the match')
            }
        }
        return isRandomPlayerMatched
        
    }
    if(!checkForRandomPlayer()){
       startRandomMatch()
    } 
    function startRandomMatch(){
      let timer = setTimeout(()=>{
            if(maxWaitForMatch === waitTick){
                // send message to stop waiting for match making after 10 secs
                clearTimeout(timer)
            } else {
                if((checkForRandomPlayer() || isNewRandomPlayMatchingReqExist[0])){
                    console.log(isNewRandomPlayMatchingReqExist)
                    isNewRandomPlayMatchingReqExist[0] = false
                    clearTimeout(timer)
                }
                else {
                    waitTick += 1000
                    if(!isWait){
                        const msg = {
                            type:'WAITFORRANDOMMATCHING',
                            data:{
                                'wait':true
                            }
                        }
                        socket.send(JSON.stringify(msg))
                        isWait = true
                    }
                    startRandomMatch()
                }
            }
        },1000)
    }
}
export default randomPlayMatching