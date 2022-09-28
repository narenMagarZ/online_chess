import {createSlice} from '@reduxjs/toolkit'



const socketAndClient = createSlice({
    name:'SOCKETCLIENT',
    initialState:{
        clientId:null,
        socket:null
    },
    reducers:{
        setClientAndSocket:(_,action)=>{
            console.log(action,'from reducer')
            return {...action.payload}
        }
    }
})

export const {setClientAndSocket} = socketAndClient.actions
export default socketAndClient.reducer