import PlayerOnGame from "./dataholder/playerongame"
export default function matchingTheRequestedPlayer(reqFrom:string,reqTo:string,playerOnGame:PlayerOnGame){
    if(playerOnGame.findPlayer(reqFrom) && playerOnGame.findPlayer(reqTo)){
        const reqToPlayer =playerOnGame.getThatPlayer(reqTo)
        const msg = {
            'type' : 'REQFORMATCH',
            'data' : {
                'from' : reqFrom,
                'to' : reqTo,
                'msg' : `${reqFrom} ask you for friendly match`
            }
        }
        reqToPlayer.socket.send(JSON.stringify(msg))
    } else {

    }
}