import { useEffect, useContext } from 'react'
import '../assets/style/leavematch.css'
import { socketContext, clientContext } from '../app'

export default function LeaveMatch({matchState}){
    const socket = useContext(socketContext)
    const me = useContext(clientContext)
    useEffect(()=>{
        function leaveMatch(){
            const msg = {
                'type' : 'LEAVEMATCH',
                'data' : {
                    'matchId' : matchState.matchId,
                    'player1' : matchState.player1,
                    'player2' : matchState.player2,
                    'playerWhoLeftMatch' : me
                }
            }
            socket.send(JSON.stringify(msg))
        }
        const leaveMatchBtn = document.getElementById('leave-match-btn')
        if(leaveMatchBtn) {
            leaveMatchBtn.addEventListener('click',leaveMatch)
        }
        return ()=>{
            leaveMatchBtn.removeEventListener('click',leaveMatch)
        }
    })
    return(
        <div className="leave-match-container">
            <div>
                <button id='leave-match-btn'>
                    leave
                </button>
            </div>
        </div>
    )
}