import { createContext, useEffect, useReducer, useRef, useState } from "react";
import ChessBoard from "./component/chessboard/chessboard";
import ListClient from "./component/listclient";
import Notifier from "./component/notifier";
import PlayRandom from "./component/playwithrandom";
import Timer from "./component/timer";
import LeaveMatch from "./component/leavematch";
import createConnectionToServer from "./createconnection";


export const socketContext = createContext(null)
export const clientContext = createContext(null)
function App() {
  const me = useRef(null)
  const socket = useRef(null)
  const [isSocket,setSocket] = useState(null)
  const [players,setPlayers] = useState([])
  const intervalState = useRef(null)
  const timerTracker = useRef({
    'minPrefix' : '0',
    'secPrefix' : '0',
    'min' : 0,
    'sec' : 0
  })
  const [isTimerOnAndMatchReady,setTimerOnOffAndMatchStatus] = useState([false,false])
  const [notifierContent,setNotifierContent] = useState({
    'type' : null,
    'title' : null,
    'msg' : null
  })
  const [matchStatus,setMatchStatus] = useState(null) 
  const [isNotifierActive,setNotifierStatus] = useState(null)
  const [movementTurn,setMovementTurn] = useState(null)
  const [isKingMurdered,setKingStatus] = useState(false)
  const matchInitialState = {
    'matchId' : null,
    'player1' : null, // this is the player, who first request to play
    'player2' : null, // this is the player, who accepted to play
    'isMatchStart' : false,
    'firstTurn' : null, // it is assign to player1
    'timerValue' : '00 : 00',
    'isTimerValueEqualTo1' : false,
    'isMatchFinished' : false,
    'isPlayerLeftMatch' : false,
    'playerWhoLeftMatchFirst' : null,
    'msg' : ''
  }
  const matchReducer = (state,{type,payload})=>{
    if(type === 'startMatch') 
      return payload
    else if(type === 'incrementTimer') 
      return payload
    else if(type === 'leftMatch')
      return payload
    else if(type === 'ignoreMatch')
      return payload
    else if(type === 'reset')
      return payload
    else return {...state}
  }
  const [matchState,matchDispatcher] = useReducer(matchReducer,matchInitialState)
  useEffect(()=>{
    function askForUserId(){
      me.current = window.prompt('Enter your name bro...')
      return createConnectionToServer(me.current)
    }
    socket.current = askForUserId()
    socketEvent(socket.current)
    function socketEvent(socket){
      socket.onmessage = (msg)=>{
        const {type,data} = JSON.parse(msg.data)
        let isSocketReady = false
        if(type === 'userid-already-exist'){
          socket.close()
          socket.current = askForUserId()
          socketEvent(socket.current)
          isSocketReady = false
        }
        else if(type === 'LISTOFPLAYERS'){
          isSocketReady = true
          const {player} = data
          setPlayers(()=>player)
        } 
        else if(type === 'WAITFORRANDOMMATCHING'){
          const {wait} = data
          setTimerOnOffAndMatchStatus(()=>[wait,false])
        } 
        else if(type === 'RANDOMPLAYMATCHINGCANCELLED'){
          console.log(data.msg)
        } 
        else if(type === 'STARTMATCH'){
          const {wait,startMatch,you,opponent,matchId,movementTurn} = data
          console.log(data,'case# start random match')
          if(!wait && startMatch) {
            setMovementTurn(()=>movementTurn)
             setTimerOnOffAndMatchStatus(()=>[false,true])
             matchDispatcher({
              'type' : 'startMatch',
              'payload' : {
                ...matchState,
                'matchId' : matchId,
                'player1' : you,
                'player2' : opponent,
                'isMatchStart' : true,
              }
             })
          }
        } 
        else if(type === 'REMOVEPLAYERWHOLEFTMATCH'){
          const {leftPlayer} = data

        } else if(type === 'PLAYERLEFTTHEMATCH'){
          const {matchLeaver} = data
          clearInterval(intervalState.current)
          if(matchLeaver) {
            matchDispatcher({
              'type' : 'leftMatch',
              'payload' : {
                ...matchState,
                'timerValue' : '00 : 00',
                'isMatchStart' : false,
                'isMatchFinished' : true,
                'isPlayerLeftMatch' : true,
                'msg' : `${matchLeaver} leave the match`
              }
            })
          }  else {
            matchDispatcher({
              'type' : 'leftMatch',
              'payload' : {
                ...matchState,
                'timerValue' : '00 : 00',
                'isMatchStart' : false,
                'isMatchFinished' : true,
                'isPlayerLeftMatch' : true,
                'msg' : ''
              }
            })
          }
          timerTracker.current = {
            'minPrefix' : '0',
            'secPrefix' : '0',
            'min' : 0,
            'sec' : 0
          }
        } else if(type === 'REQFORMATCH'){
          const {from,to,msg} = data
          console.log(from,to,msg)
          setNotifierStatus(()=>true)
          setNotifierContent(()=>{
            return {
              'type' : 'PLAYREQUEST',
              'title' : 'Match request',
              'msg' : msg,
              'from' : from,
              'to' : to
            }
          })

        }
        else if(type === 'AFTERIGNOREPLAYREQUEST'){
          console.log(data)
          const {msg} = data
          setMatchStatus(()=>null)
          setNotifierStatus(()=>true)
          setNotifierContent(()=>{
            return {
              'type' : 'IGNOREPLAYREQUEST',
              'title' : 'Ignore match request',
              'msg' : msg
            }
          })
          matchDispatcher({
            'type' : 'ignoreMatch',
            'payload' : {
              ...matchState,
              'isMatchStart' : false,
              'player1' : null,
              'player2' : null,
              'firstTurn' : null,
            }
          })

        }
        else if(type === 'AFTERACCEPTTHEPLAYREQUEST'){
          console.log(data)
        }
        //else if(type === 'STARTMATCH'){
         // const {player1,player2,matchId} = data
          //console.log(data,'case# startmatch')
         // matchDispatcher({
           // 'type' : 'startMatch',
           // 'payload' : {
             // ...matchState,
              //'matchId' : matchId,
             // 'player1' : player1,
              //'player2' : player2,
              //'firstTurn' : player1,
              //'isMatchStart' : true,
            //}
          //})
        //}
        else if(type === 'PLAYERMOVEMENT') {
          
        } else if(type === 'testmsg'){
          let {prevCord,currentCord,id,reverseId,prevId,prevReverseId,movementTurn} = data
          setMovementTurn(()=>movementTurn)
          const destinationColWrapper =  document.querySelector(`#col-wrapper[data-id="${reverseId}"]`)
          const sourceColWrapper = document.querySelector(`#col-wrapper[data-id="${prevReverseId}"]`)          
          sourceColWrapper.children[0].setAttribute('data-cord',destinationColWrapper.dataset.cord)
          sourceColWrapper.children[0].setAttribute('data-reversecord',destinationColWrapper.dataset.reversecord)
          console.log(destinationColWrapper.children[0],'case# this is destinationcolwrapper child')
          if(destinationColWrapper.children[0]){
            destinationColWrapper.removeChild(destinationColWrapper.children[0])
          }
          destinationColWrapper.appendChild(sourceColWrapper.children[0])
          
        }
        if(isSocketReady) {
          setSocket(()=>true)
        }
      }
      socket.onclose = ()=>{
        console.log('socket connection closed.')
      }
      socket.onopen = ()=>{
        console.log('socket connection opened.')
      }
    }
    return ()=>{
      if(socket.current){
        socket.current.close()
        socket.current = null
      }
    }
  },[])
  const setOffWaitTimerAndMatchStatus = ()=>{
    setTimerOnOffAndMatchStatus(()=>[false,false])
  }
  const closeNotifier = ()=>{
    setNotifierStatus(()=>false)
  }
  const callSetMatchStatus = (status)=>{
    setMatchStatus(()=>status)
  }
  const setMovementTurnToNull = ()=>{
    setMovementTurn(()=>null)
  }
  const murderedTheKing =()=>{
    setKingStatus(()=>true)
  }
  useEffect(()=>{
    const {isMatchStart,isTimerValueEqualTo1} = matchState
    if(isMatchStart && !isTimerValueEqualTo1){
      intervalState.current = setInterval(()=>{
        timerTracker.current.sec ++
        if(timerTracker.current.sec === 60){
          timerTracker.current.sec = 0
          timerTracker.current.min ++
        }
        if(timerTracker.current.sec >= 10) timerTracker.current.secPrefix = ''
        else timerTracker.current.secPrefix = '0'
        if(timerTracker.current.min >= 10) timerTracker.current.minPrefix = ''
        else timerTracker.current.minPrefix = '0'
        matchDispatcher({
          'type' : 'incrementTimer',
          'payload' : {
            ...matchState,
            'isTimerValueEqualTo1' : true,
            'timerValue' : 
            `${timerTracker.current.minPrefix}${timerTracker.current.min} : 
             ${timerTracker.current.secPrefix}${timerTracker.current.sec}` 
          }
        })
      },1000)
    }
  },[matchState])

  useEffect(()=>{
    if(isKingMurdered){
      console.log('king down')
    }
  },[isKingMurdered])
  if(socket.current && isSocket)
  return (
    <socketContext.Provider value={socket.current}>
      <clientContext.Provider value={me.current}>
    <div className="app">
      <PlayRandom 
      isTimerOn = {isTimerOnAndMatchReady} 
      isMatchFinished = {matchState.isMatchFinished}
      setOffWaitTimer = {setOffWaitTimerAndMatchStatus} />
      <div className="app-inner-container">
      <ListClient 
      callSetMatchStatus = {callSetMatchStatus}
      matchStatus = {matchStatus}
      isMatchStart={matchState.isMatchStart}
      players = {players} />
      <div className="t">
        <div className="u" >
     {
      matchState.isMatchStart ? <Timer matchState = {matchState} /> : ''
     } 
     {
      matchState.isMatchStart ? <LeaveMatch matchState = {matchState} /> : ''
     }
        </div>
      <ChessBoard
      isKingMurdered = {isKingMurdered}
      murderedTheKing = {murderedTheKing}
      me = {me.current}
      matchState = {matchState}
      movementTurn = {movementTurn}
      setMovementTurnToNull = {setMovementTurnToNull}
       />
      </div>
      </div>
      {
        isNotifierActive ? <Notifier 
        content={notifierContent} 
        closeNotifier = {closeNotifier}
        /> : ''
      }
    </div>
      </clientContext.Provider>
    </socketContext.Provider>
  )
  else return (
    <div></div>
  )
}

export default App;
