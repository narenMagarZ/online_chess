import { Server } from 'http';
import Websocket from 'ws'
import randomPlayMatching from './randomplaymatching'
import { RandomMatchReq } from './dataholder/randomreqplayer';
import cancelRandomPlayMatching from './cancelrandomplaymatching';
import playerLeftGame from './playerleftgame';
import { playerOnMatch } from './dataholder/playeronmatch';
import matchingTheRequestedPlayer from './matchingthereqplayer';
import PlayerOnGame from './dataholder/playerongame';
import generateMatchId from './utils/generatematchid';
export let prevClients : any[] = []
let clients : any = {}
let randomPlayerId = 0
const isNewRandomPlayMatchingReqExist : any[] = []
isNewRandomPlayMatchingReqExist[0] = false

function wsServer(httpServer:Server){
    const webSocketServer = new Websocket.Server({noServer:true})
    const randomMatchReq = new RandomMatchReq()
    const playerOnGame = new PlayerOnGame()
    httpServer.on('upgrade',(request,socket,head)=>{
        webSocketServer.handleUpgrade(request,socket,head,(client)=>{
            webSocketServer.emit('connection',client,request)
        })
    })

    webSocketServer.on('connection',(client,req)=>{
        const clientId = req.url?.split('/')[1].trim() as string
        interface resMsg {
            type:any
            data:any
        }
        let resMsg : resMsg = {
            'type':null,
            'data':null
        }
        if(prevClients.indexOf(clientId) >= 0){
            resMsg = {
                'type':'userid-already-exist',
                'data':null
            }
            client.send(JSON.stringify(resMsg))
        }
        else {
            prevClients.push(clientId)
            let thisClient : any = {}
            const clientSocket = thisClient.socket = clients[clientId] = client
            thisClient.id = clientId
            playerOnGame.insertPlayer(clientId,clientSocket)
            for(const i in clients){
                let player = [...prevClients]
                if(player.length === 1) player = []
                else player.splice(player.indexOf(i),1)
                const data = {
                    'type':'LISTOFPLAYERS',
                    'data':{
                        'player' : player
                    }
                }
                clients[i].send(JSON.stringify(data))
            }
            thisClient.socket.on('close',()=>{
                prevClients.splice(prevClients.indexOf('umesh'),1)
                console.log('connection is closed by client')
                delete clients[thisClient.id]
                // delete clients
            })
            thisClient.socket.on('message',async(msg:any)=>{
                const clientMsg = JSON.parse(msg.toString())
                const {type,data} = clientMsg
                let resMsg : any
                switch(type.trim()){
                    case "player-movement":
                        resMsg = {
                            'type':'remote-player-movement',
                            'data':{
                                'X':2,
                                'Y':4
                            }
                        }
                        console.log(data)
                        thisClient.socket.send(JSON.stringify(resMsg))
                        break
                    case "ASKFORFRIENDLYMATCH":
                        const {reqFrom,reqTo} = data
                        const res = matchingTheRequestedPlayer(reqFrom,reqTo,playerOnGame)
                        break
                    case "STARTMATCH":
                        console.log(data,'from start match case#')
                        break
                    case "PLAYERMOVEMENT":
                        console.log(data,'player movement case#')
                        const {me,you,prevCord,currentCord,id,reverseId,prevId,prevReverseId,movementTurn} = data
                        const tMsg = {
                            type : 'testmsg',
                            data : {
                                'prevCord' : prevCord,
                                'currentCord' : currentCord,
                                'id' : id,
                                'reverseId' : reverseId,
                                prevId,
                                prevReverseId,
                                'movementTurn' : movementTurn 

                            }
                        }
                        playerOnGame.getThatPlayer(you).socket.send(JSON.stringify(tMsg))
                        break
                    case "RANDOMPLAYMATCHING":
                        randomPlayerId ++
                        randomMatchReq.push({
                            playerName:data.playerId,
                            playerId:randomPlayerId,
                            socket:thisClient.socket,
                            reqAt:new Date(Date.now()).getTime()
                        })
                        randomPlayMatching(
                            randomMatchReq,
                            randomPlayerId,
                            thisClient.socket,
                            isNewRandomPlayMatchingReqExist
                            )
                            break;
                    case "CANCELRANDOMPLAYMATCHING":
                        cancelRandomPlayMatching(randomMatchReq,data.playerId)
                        resMsg = {
                            'type' : 'RANDOMPLAYMATCHINGCANCELLED'
                        }
                        thisClient.socket.send(JSON.stringify(resMsg))
                        break;
                    case 'LEAVEMATCH':
                        const removedUser = playerOnMatch.remove(data.matchId) // here both random and friendly requested user most be stored 
                        for(let user in removedUser) {
                             if(removedUser[user].id !== data.playerWhoLeftMatch){
                                removedUser[user].socket.send(JSON.stringify({
                                    'type' : 'PLAYERLEFTTHEMATCH',
                                    'data' : {
                                        'matchLeaver' : data.playerWhoLeftMatch
                                    }
                                }))
                             } else {
                                removedUser[user].socket.send(JSON.stringify({
                                    'type' : 'PLAYERLEFTTHEMATCH',
                                    'data' : {
                                        'matchleaver' : null
                                    }

                                }))
                             }
                        }
                        break;
                    case "IGNORETHEPLAYREQUEST":
                        console.log(data)
                        const {msg,from} = data
                        const content = {
                            'type' : 'AFTERIGNOREPLAYREQUEST',
                            'data' : {
                                'msg' : msg
                            }
                        }
                        clients[from].send(JSON.stringify(content))
                        break
                    case "ACCEPTTHEPLAYREQUEST":
                        const matchId = generateMatchId()
                        const {player1,player2} = data
                        playerOnMatch.insert(
                            matchId,
                            player1,
                            player2,
                            playerOnGame.getThatPlayer(player1).socket,
                            playerOnGame.getThatPlayer(player2).socket)
                        if(player1 && player2) {
                            let data = {
                                'player1' : player1,
                                'player2' : player2,
                                'matchId' : matchId,
                                'firstTurn' : 'player1'
                            }
                            let msg = {
                                'type' : 'STARTMATCH',
                                'data' : {...data}
                            }
                            clients[player1].send(JSON.stringify(msg))
                            clients[player2].send(JSON.stringify(msg))
                        }
                        break
                    default:
                        break
                }
            })
        }

    })
    webSocketServer.on('close',()=>{
        console.log('connection closed')
    })
}


export default wsServer