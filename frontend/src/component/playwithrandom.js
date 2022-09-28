import { useEffect, useMemo, useState ,useRef, useContext} from 'react'
import '../assets/style/playrandom.css'
import { socketContext, clientContext } from '../app'

function PlayRandom(
    {
        isTimerOn,
        setOffWaitTimer,
        isMatchFinished
    }){
    const socket = useContext(socketContext)
    const player = useContext(clientContext)
    const [matchState,setMatchState] = useState('play')
    const [waitTimer,setWaitTimer] = useState(1)
    const isRandomMatchReqOnWait = useRef(false)
    let interval = useRef(null)
    useEffect(()=>{
        const playWithRandom = document.getElementById('play-with-random')
        function playRandomly(){
            isRandomMatchReqOnWait.current = isRandomMatchReqOnWait.current ? false : true
            if(!isRandomMatchReqOnWait.current) {
                clearInterval(interval.current)
                setOffWaitTimer()
                setWaitTimer(0)
                setMatchState(()=>'play')
                const cancelMsg = {
                    'type' : 'CANCELRANDOMPLAYMATCHING',
                    'data' : {
                        'playerId' : player 
                    }
                }
                socket.send(JSON.stringify(cancelMsg))
            } else {
                setMatchState(()=>'matching...')
                if(socket){
                    const reqMsg = {
                        'type' : 'RANDOMPLAYMATCHING',
                        'data' : {
                            'playerId':player
                        }
                    }
                    socket.send(JSON.stringify(reqMsg))
                    
                }
            }
        }
        if(playWithRandom){
            playWithRandom.addEventListener('click',playRandomly)
        }
        return ()=>{
            playWithRandom.removeEventListener('click',playRandomly)
        }
    },[player,socket,setOffWaitTimer])
    useEffect(()=>{
        if(isTimerOn[0]){
            interval.current = setInterval(()=>{
                setWaitTimer((prevWaitTimer)=>prevWaitTimer + 1)
            },1000)
        } else if(!isTimerOn[0]) {
            clearInterval(interval.current)
        }
    },[isTimerOn])
    useMemo(()=>{
        if(isTimerOn[0]){
            setMatchState(()=>`${waitTimer} Cancel`)
        } else if(!isTimerOn[0] && isTimerOn[1]) {
            setMatchState(()=>'playing') // after leave the match set it back to play
        }
    },[waitTimer,isTimerOn])
    useEffect(()=>{
        if(isMatchFinished){
            isRandomMatchReqOnWait.current = false
            setMatchState(()=>'play')
        }
    },[isMatchFinished])
    return(
        <div className='play-with-random-container'>
            <span>
                Play with random ?
            </span>
            <button 
            className='play-with-random-btn' id='play-with-random'
            >
                {matchState}
            </button>
        </div>
    )
}

export default PlayRandom