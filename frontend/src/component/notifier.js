import { useEffect , useContext} from 'react'
import { socketContext } from '../app'
import '../assets/style/notifier.css'
import {ImNotification} from 'react-icons/im'
export default function Notifier({content,closeNotifier}){
    return(
        <div className='notifier-container'>
            <div className='notifier-box-container'>
                <div id='notifier-head-container'>
                    <span>
                        Notice
                    </span>
                </div>
                <div id='notifier-content-container'>
                    <button id='notifier-notification-container'>
                        <ImNotification id='notifier-icon'/>
                    </button>
                {content.msg}    
                </div>   
                <NotifierActionButton 
                content = {content}
                closeNotifier = {closeNotifier}/>
                </div>
        </div>
    )
}



function NotifierActionButton({content,closeNotifier}){
    const socket = useContext(socketContext)
    function ignoreToPlay(){
        closeNotifier()
        console.log('ignore the match')
        const msg = {
            'type' : 'IGNORETHEPLAYREQUEST',
            'data' : {
                'from' : content.from,
                'msg' : `${content.to} ignore the request`
            }
        }
        socket.send(JSON.stringify(msg))
    }
    function okToPlay(e){
        closeNotifier()
        if(e.target.name === 'accept')  {
            const msg = {
                'type' : 'ACCEPTTHEPLAYREQUEST',
                'data' : {
                    'accept' : true,
                    'player1' : content.from,
                    'player2' : content.to
                }
            }
            socket.send(JSON.stringify(msg))
        }     
    }
    useEffect(()=>{
        const notifierCancelBtn = document.getElementById('notifier-cancel-btn')
        const notifierOkBtn = document.getElementById('notifier-ok-btn')
        if(notifierCancelBtn) notifierCancelBtn.addEventListener('click',ignoreToPlay)
        if(notifierOkBtn) notifierOkBtn.addEventListener('click',okToPlay)
        return ()=>{
            if(notifierCancelBtn)
                notifierCancelBtn.removeEventListener('click',ignoreToPlay)
            if(notifierOkBtn) notifierOkBtn.removeEventListener('click',okToPlay)

        }
    })
    
    switch(content.type){
        case "MATCHLEFT":
            return (
                <div>

                </div>
            )
        case "PLAYREQUEST":

            return (
                <div id='notifier-action-btn-container'>
                    <button id='notifier-cancel-btn'>
                        Cancel
                    </button>
                    <button name='accept' id='notifier-ok-btn'>
                        Ok
                    </button>
                </div>
            )
        case "IGNOREPLAYREQUEST":
           return ( 
           <div id='notifier-action-btn-container'>
            <button name='ok' id='notifier-ok-btn'>
                Ok
            </button>
            </div>
           )
        default:
            return (
                <div></div>
            )
    }

}