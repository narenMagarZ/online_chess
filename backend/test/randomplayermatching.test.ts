import webSocket from 'ws'
describe('random player matching',()=>{
    const client = new webSocket('ws://localhost:5000')
    let players : string[] = []
    const PLAYERLEN = 500
    for(let i = 1 ; i <= PLAYERLEN; i ++){
        players.push(`player${i}`)
    }
    client.onopen = ()=>{
        for(const player of players){
                client.send(JSON.stringify({
                    name:'RANDOMPLAYMATCHING',
                    data:{
                        'player':player
                    }
                }))
        }
    }
})

// describe('random player matching',()=>{
//     const client = new webSocket('ws://localhost:5000')
//     client.onopen = ()=>{
//         client.send(JSON.stringify({
//             name:'RANDOMPLAYMATCHING',
//             data:{
//                 'player':'player1'
//             }
//         }))
//         client.onmessage = (msg)=>{
//             console.log(msg.data)
//         }
//         setTimeout(()=>{
//             client.send(JSON.stringify({
//                 name:'RANDOMPLAYMATCHING',
//                 data:{
//                     'player':'player2'
//                 }
//             }))
//         },5000)
//     }
// })
