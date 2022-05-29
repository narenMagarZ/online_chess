import HOST_BISHOP from '../pieces/host_pieces/host_bishop.svg'
import HOST_KNIGHT from '../pieces/host_pieces/host_knight.svg'
import HOST_ROOK from '../pieces/host_pieces/host_rook.svg'
import HOST_KING from '../pieces/host_pieces/host_king.svg'
import HOST_QUEEN from '../pieces/host_pieces/host_queen.svg'

import REMOTE_BISHOP from '../pieces/remote_pieces/remote_bishop.svg'
import REMOTE_KNIGHT from '../pieces/remote_pieces/remote_knight.svg'
import REMOTE_ROOK from '../pieces/remote_pieces/remote_rook.svg'
import REMOTE_KING  from '../pieces/remote_pieces/remote_king.svg'
import REMOTE_QUEEN from '../pieces/remote_pieces/remote_queen.svg'
export const LoadHostPieces = ()=>{
    return [
        {id:'rook',val:HOST_ROOK,type:'host'},
        {id:'knight',val:HOST_KNIGHT,tyoe:'host'},
        {id:'bishop',val:HOST_BISHOP,type:'host'},
        {id:'queen',val:HOST_QUEEN,type:'host'},
        {id:'king',val:HOST_KING,type:'host'},
        {id:'bishop',val:HOST_BISHOP,type:'host'},
        {id:'knight',val:HOST_KNIGHT,type:'host'},
        {id:'rook',val:HOST_ROOK,type:'host'},

]
}

export const LoadRemotePieces = ()=>{
    return [
        {id:'rook',val:REMOTE_ROOK,type:'remote'},
        {id:'knight',val:REMOTE_KNIGHT,type:'remote'},
        {id:'bishop',val:REMOTE_BISHOP,type:'remote'},
        {id:'queen',val:REMOTE_QUEEN,type:'remote'},
        {id:'king',val:REMOTE_KING,type:'remote'},
        {id:'bishop',val:REMOTE_BISHOP,type:'remote'},
        {id:'knight',val:REMOTE_KNIGHT,type:'remote'},
        {id:'rook',val:REMOTE_ROOK,type:'remote'},

]
}