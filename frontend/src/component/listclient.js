import '../assets/style/listclient.css'
import {MdAddCircleOutline} from 'react-icons/md'
import {RiCloseCircleLine} from 'react-icons/ri'
import {  useEffect, useMemo, useState , useContext} from 'react'
import { socketContext, clientContext } from '../app'
function ListClient({players,isMatchStart,callSetMatchStatus,matchStatus}){
    const socket = useContext(socketContext)
    const client = useContext(clientContext)
    const [player,setPlayer] = useState([])
    const [prevPlayerWhomAskForMatch,setPrevPlayerWhomAskForMatch] = useState({
        'prevAskForMatchBtn' : null,
        'prevAskForMatchId' : null
    })
    const [activeBtn,setActiveBtn] = useState({type:null,value:null,index:null})
    useMemo(()=>{
        setPlayer(()=>players) 
    },[players])
    useEffect(()=>{
        function askForPlayRequest(e){
            if(activeBtn.type === 'askReq'){
                activeBtn.value.nextSibling.classList.remove('active-req-controller-btn')
                activeBtn.value.nextSibling.classList.add('inactive-req-controller-btn')
                activeBtn.value.classList.remove('inactive-req-controller-btn')
                activeBtn.value.classList.add('active-req-controller-btn')
            } else {
                setActiveBtn(()=>{
                    return {
                        'type' : null,
                        'value' : null
                    }
                })
            }
            setActiveBtn(()=>{
                    return {
                        'type' : 'askReq',
                        'value' : e.target
                    }
                })
            if(prevPlayerWhomAskForMatch.prevAskForMatchBtn &&
                prevPlayerWhomAskForMatch.prevAskForMatchId){
                prevPlayerWhomAskForMatch.prevAskForMatchBtn.innerHTML = prevPlayerWhomAskForMatch.prevAskForMatchId
            }
            e.target.classList.remove('active-req-controller-btn')
            e.target.classList.add('inactive-req-controller-btn')
            e.target.nextSibling.classList.remove('inactive-req-controller-btn')
            e.target.nextSibling.classList.add('active-req-controller-btn')
            const {id} = e.target.dataset
            const reqMsg = {
                'type' : 'ASKFORFRIENDLYMATCH',
                'data' : {
                    'reqFrom' : client,
                    'reqTo' : id
                }
            }
            const prevSibling = e.target.previousSibling
            setPrevPlayerWhomAskForMatch(()=>{
                return {
                    'prevAskForMatchBtn' : prevSibling,
                    'prevAskForMatchId' : id,
        }})
            prevSibling.innerHTML = 'waiting...'
            callSetMatchStatus('pending')
            socket.send(JSON.stringify(reqMsg))
        }
        function cancelPlayRequest(e){
            prevPlayerWhomAskForMatch.prevAskForMatchBtn.innerHTML = prevPlayerWhomAskForMatch.prevAskForMatchId
            if(activeBtn.type === 'askReq'){
                setActiveBtn(()=>{
                    return {
                        'type' : null,
                        'value' : null
                    }
                })
            }
            e.target.classList.remove('active-req-controller-btn')
            e.target.classList.add('inactive-req-controller-btn')
            e.target.previousSibling.classList.remove('inactive-req-controller-btn')
            e.target.previousSibling.classList.add('active-req-controller-btn')
        }
        function addEventToAddBtn(){
            const requestBtn = document.querySelectorAll('.add-friend-btn')
                    requestBtn.forEach((btn)=>{
                        btn.addEventListener('click',askForPlayRequest)
                    })
                return requestBtn
        }
        function addEventToCancelBtn(){
            const cancelReqBtn = document.querySelectorAll('.cancel-play-req-btn')
            cancelReqBtn.forEach((btn)=>{
                btn.addEventListener('click',cancelPlayRequest)
            })  
            return cancelReqBtn
        }

        const requestBtn = addEventToAddBtn()
        const cancelReqBtn = addEventToCancelBtn()
        return()=>{
            requestBtn.forEach((btn)=>{
                btn.removeEventListener('click',askForPlayRequest)
            })
            cancelReqBtn.forEach((btn)=>{
                btn.removeEventListener('click',cancelPlayRequest)
            })
         
        }
    },[player,client,socket,prevPlayerWhomAskForMatch,activeBtn,callSetMatchStatus])

    useEffect(()=>{
        const {prevAskForMatchBtn,prevAskForMatchId} = prevPlayerWhomAskForMatch
        if((prevAskForMatchBtn  && isMatchStart) || (prevAskForMatchBtn && matchStatus === null)){
            prevAskForMatchBtn.innerHTML  = prevAskForMatchId
            const addBtn = prevAskForMatchBtn.nextSibling
            const cancelBtn = addBtn.nextSibling
            
            if(cancelBtn){
                cancelBtn.classList.remove('active-req-controller-btn')
                cancelBtn.classList.add('inactive-req-controller-btn')
            } 
            if(addBtn){
                addBtn.classList.remove('inactive-req-controller-btn')
                addBtn.classList.add('active-req-controller-btn')
    
            }
        }
    },[isMatchStart,prevPlayerWhomAskForMatch,matchStatus])
    

    return (
        <div className='list-client-container'>
            <b>Player available</b>
            {
                player.map((id,index)=>{
                    return (
                        <div id='id-wrapper' key={index}>
                          
                            <button id='friend-btn'>
                                {
                                    client === id ? id + ' (me) ' : id
                                }
                            </button> 
                            <button data-id={id} className='add-friend-btn active-req-controller-btn'>
                            <MdAddCircleOutline id='request-friend-icon'/>
                            </button>   
                            <button className='cancel-play-req-btn inactive-req-controller-btn'>
                            <RiCloseCircleLine id='cancel-play-req-icon' />
                            </button>
                        </div>
                    )
                })
            }
        </div>
    )
}
export default ListClient