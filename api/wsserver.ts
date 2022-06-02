import { Server } from 'http';
import Websocket from 'ws'


export default function WsServer(httpServer:Server){
    const webSocketServer = new  Websocket.Server({noServer:true})
    httpServer.on('upgrade',(request,socket,head)=>{
        webSocketServer.handleUpgrade(request,socket,head,()=>{
            webSocketServer.emit('connection',socket,request)
        })
    })


    webSocketServer.on('connection',(socket,request)=>{
        console.log('connection is opened')

    })
}
