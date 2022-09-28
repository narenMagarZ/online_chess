import {configureStore} from '@reduxjs/toolkit'
import clientSocketReducer from './component/chessboard/socketclientslice'
export const store = configureStore({
    reducer :{
        createClientAndSocket:clientSocketReducer
    }
})