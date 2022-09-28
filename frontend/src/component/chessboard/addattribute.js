
export function AddAttribute(piece,pieceWrapper,id,type,val){
    piece.setAttribute('src',val)
    pieceWrapper.setAttribute('data-id',id)
    pieceWrapper.setAttribute('data-type',type)
}
