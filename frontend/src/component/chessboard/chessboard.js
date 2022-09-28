import { useEffect, useRef, useContext, useState } from 'react'
import {useDispatch} from 'react-redux'
import '../../assets/style/chessboard.css'
import {LoadHostPieces,LoadRemotePieces} from './loadpieces'
import BK_PAWN  from '../../assets/pieces/remote_pieces/remote_pawn.svg'
import WH_PAWN from '../../assets/pieces/host_pieces/host_pawn.svg'
import { AddAttribute } from './addattribute'
import { socketContext } from '../../app'
function ChessBoard({matchState,me,movementTurn,setMovementTurnToNull}){
    const socket = useContext(socketContext)
    const dispatcher = useDispatch()
    const playgroundContainer = useRef(null)
    const possiblePath = useRef([])
    const activePiece = useRef({
        'piece':null,
        'cord':{
            'X' : null,
            'Y' : null
        },
        'reverseCord' : {
            'Xr' : null,
            'Yr' : null
        }
    })
    const playerMovement = useRef({
        'matchId' : null,
        'you' : null,
        'me' : null,
    })
    const deactivatedPieces = useRef([])
    const activePieceType = useRef('host')
    const selectedPieceCoordinate = useRef({'x':null,'y':null})
    // const board = useRef(new Array(8).fill(new Array(8).fill(null)))
    const board = useRef([
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        ])
    useEffect(()=>{
        const {isMatchStart} = matchState
        console.log(movementTurn,'case# this is movementTurn')
        if(isMatchStart && movementTurn === me){
            const playgroundWrapperCover = document.querySelector('.inner-playground-wrapper-cover')
            if(playgroundWrapperCover){
                playgroundWrapperCover.classList.remove('inactive-playground-cover')
                playgroundWrapperCover.classList.add('active-playground-cover')
            }
        const inactivatedPieces = document.querySelectorAll('.inactive-piece')
        console.log(inactivatedPieces,'case# these are the inactivated pieces')
        inactivatedPieces.forEach((piece)=>{
            piece.classList.replace('inactive-piece','active-piece')
        })
        }
    },[matchState,movementTurn,me])
    useEffect(()=>{
        playerMovement.current = {
                'matchId' : matchState.matchId,
                'you' : matchState.player2,
                'me' : matchState.player1,

            
        }
    },[matchState])
    function buildPlayground(){
        playgroundContainer.current = document.getElementById('inner-playground-wrapper')
        if(playgroundContainer.current){
            let backgroundCover = false
            for(let row = 0 ; row < 8 ; row ++){
                const rowWrapper = document.createElement('div')
                rowWrapper.setAttribute('id','row-wrapper')
                for (let col = 0 ; col < 8 ; col ++ ){
                    const colWrapper = document.createElement('div')
                    colWrapper.setAttribute('id','col-wrapper')
                    if(!backgroundCover){
                        colWrapper.setAttribute('class','cover-bg')
                        backgroundCover = true
                    }
                    else {
                        colWrapper.setAttribute('class','non-cover-bg')
                        backgroundCover = false
                    }
                    board.current[row][col] = colWrapper
                    const pieceWrapperCord = JSON.stringify({X:row,Y:col})
                    const pieceWrapperReverseCord = JSON.stringify({
                        'Xr' : 7 - row,
                        'Yr' : col
                    })
                    const reverseId = [7-row,col].join('')
                    const id = [row,col].join('')
                    colWrapper.setAttribute('data-reversecord',pieceWrapperReverseCord)
                    colWrapper.setAttribute('data-cord',pieceWrapperCord)
                    colWrapper.setAttribute('data-id',id)
                    colWrapper.setAttribute('data-reverseid',reverseId)
                    if(row === 0 || row === 7 || row ===1 || row === 6){
                        const pieceWrapper = document.createElement('div')
                        if(row === 6 || row === 7) 
                            pieceWrapper.addEventListener('click',computePath)
                        pieceWrapper.setAttribute('id','piece-wrapper')
                        const piece = document.createElement('img')
                        piece.setAttribute('id','piece')
                        pieceWrapper.setAttribute('data-cord',pieceWrapperCord)
                        pieceWrapper.setAttribute('data-reversecord',pieceWrapperReverseCord)
                        if(row === 0){
                            const {id,val,type} = LoadRemotePieces()[col]
                            // pieceWrapper.classList.add('inactive-piece')
                            AddAttribute(piece,pieceWrapper,id,type,val)
                        }
                        else if(row === 7){
                            const {id,val,type} = LoadHostPieces()[col]
                            pieceWrapper.classList.add('active-piece')
                            AddAttribute(piece,pieceWrapper,id,type,val)
                        }
                        else if(row === 1){
                            // pieceWrapper.classList.add('inactive-piece')
                            AddAttribute(piece,pieceWrapper,'pawn','remote',BK_PAWN)
                        } 
                        else if(row === 6) {
                            pieceWrapper.classList.add('active-piece')
                            AddAttribute(piece,pieceWrapper,'pawn','host',WH_PAWN)
                        }
                        pieceWrapper.appendChild(piece)
                        colWrapper.appendChild(pieceWrapper)
                    }
                    rowWrapper.appendChild(colWrapper)
                }
                backgroundCover =  backgroundCover === true ? false : true
                playgroundContainer.current.appendChild(rowWrapper)
            }
        }
    }

    function computePath({target}){
        console.log(deactivatedPieces,'case# deactivated pieces ')
        let {cord,id,type,reversecord} = target.dataset
        cord = JSON.parse(cord)
        reversecord = JSON.parse(reversecord)
        selectedPieceCoordinate.current = cord
        console.log(possiblePath.current,'case# possible path current')
        if(possiblePath.current.length > 0){
            const len = possiblePath.current.length
            for(let i = 0 ; i < len ;i++) {
                possiblePath.current[i].classList.remove('possible-path-bg')
                possiblePath.current[i].removeEventListener('click',holdPiece)
                possiblePath.current[i] = []
            }
        }
        for(let i = 0 ; i < deactivatedPieces.current.length ; i++)
            deactivatedPieces.current[i].addEventListener('click',computePath)
        
        deactivatedPieces.current = []
        possiblePath.current = []

        let {X,Y} = cord
        X = parseInt(X)
        Y = parseInt(Y)
        activePiece.current.piece = target
        activePiece.current.cord = cord
        activePiece.current.reverseCord = reversecord
        if(type === 'host'){
            switch(id){
                case "pawn":
                    pawnMovement(X,Y,'host')
                    break;
                case "rook":
                    computePathForRook(X,Y,'host')
                    attachClickHandlerToPiece()
                    break;
                case "knight":
                    knightMovement(X,Y,'host')
                    attachClickHandlerToPiece()
                    break;
                case "bishop":
                    computePathForBishop(X,Y,'host')
                    attachClickHandlerToPiece()
                    break;
                case "queen":
                    computePathForRook(X,Y,'host')
                    computePathForBishop(X,Y,'host')
                    attachClickHandlerToPiece()
                    break;
                case "king":
                    kingMovement(X,Y,'host')
                    attachClickHandlerToPiece()
                    break;
                default :
                    break;
            }
        }
    }

    function holdPiece({target}){
        const {cord,reversecord} = target.dataset
        const {X,Y} = JSON.parse(cord)
        const {Xr,Yr} = JSON.parse(reversecord)
        const id = [X,Y].join('')
        const reverseId = [Xr,Yr].join('')
        const prevId = [activePiece.current.cord['X'],activePiece.current.cord['Y']].join('')
        const prevReverseId = [activePiece.current.reverseCord['Xr'],activePiece.current.reverseCord['Yr']].join('')
        console.log(activePiece.current,'case# activepiece.currnet')
        playerMovement.current = {
            ...playerMovement.current,
        }
        const msg = {
            'type' : 'PLAYERMOVEMENT',
            'data' : {
                ...playerMovement.current,
                'id' : id,
                'reverseId' : reverseId,
                'prevId' : prevId,
                'prevReverseId' : prevReverseId,
                'prevCord' : {...activePiece.current.reverseCord},
                'prevReverseCord' : {...activePiece.current.cord},
                'currentCord' : {'CXr':Xr,'CYr':Yr},
                'movementTurn' : playerMovement.current.you,
            } 
        }
       const playgroundWrapperCover = document.querySelector('.inner-playground-wrapper-cover')
       if(playgroundWrapperCover){
           playgroundWrapperCover.classList.remove('active-playground-cover')
           playgroundWrapperCover.classList.add('inactive-playground-cover')
       }
        console.log(playerMovement.current,'case# palyermovement.current')
        socket.send(JSON.stringify(msg))
        const pieceWrapperCord = JSON.stringify({X,Y})
        const pieceWrapperReverseCord = JSON.stringify({Xr,Yr})
        activePiece.current.piece.setAttribute('data-cord',pieceWrapperCord)
        activePiece.current.piece.setAttribute('data-reversecord',pieceWrapperReverseCord)
        const inactivatedPieces = document.querySelectorAll('.inactive-piece')
        const activatedPieces = document.querySelectorAll('.active-piece')
        
        //here checking for the children of targeted box
        
        if(target.children.length > 0){
            target.removeChild(target.children[0])
            target.appendChild(activePiece.current.piece)
        }
        else target.appendChild(activePiece.current.piece)
        for(let pathIndex = 0 ; pathIndex < possiblePath.current.length ; pathIndex ++){
            possiblePath.current[pathIndex]?.classList.remove('possible-path-bg')
            possiblePath.current[pathIndex]?.removeEventListener('click',holdPiece)
        }
        console.log(deactivatedPieces.current,'case# from hold piece deactivated piece')
        for(let i =0 ; i<deactivatedPieces.current.length;i++) 
            deactivatedPieces.current[i].addEventListener('click',computePath)
        deactivatedPieces.current = []
            activatedPieces.forEach((pieceWrapper)=>{
                pieceWrapper.classList.remove('active-piece')
                pieceWrapper.classList.add('inactive-piece')
            })
            setMovementTurnToNull()
            console.log(activatedPieces,'case# these are the activated pieces')
        possiblePath.current= []

    }

    function attachClickHandlerToPiece(){
        for(let i = 0 ;i<possiblePath.current.length ;i++){
            if(possiblePath.current[i].children.length > 0){
                possiblePath.current[i].children[0].removeEventListener('click',computePath)
                deactivatedPieces.current.push(possiblePath.current[i].children[0])
            }
            possiblePath.current[i].addEventListener('click',holdPiece)
        }

    
    }

    function activateComputedPath(validBox,type){
        if(validBox.children.length > 0) {
            if(type === 'host') {
                if(validBox.children[0]?.dataset.type === 'host') return false
                else {
                    validBox?.classList.add('possible-path-bg') 
                    possiblePath.current.push(validBox)
                    return false
                } 
            }
            else if(type === 'remote') {
                if(validBox.children[0]?.dataset.type === 'remote') return false 
                else {
                    validBox?.classList.add('possible-path-bg')
                    possiblePath.current.push(validBox)
                    return false
                }

            }
            else {
                validBox?.classList.add('possible-path-bg')
                possiblePath.current.push(validBox)
                return false
            }
        }
        else {
            validBox?.classList.add('possible-path-bg') 
            return true
        }
    }

    function computePathForBishop(X,Y,type){
        let J = X 
        let K = Y
        for(;;){
            K -- 
            J --
            if(J < 0 || K < 0) break;
            const validBox = board.current[J][K]
            const isPathActivated = activateComputedPath(validBox,type)
            if(!isPathActivated) break
            else possiblePath.current.push(validBox)
        }
        J = X 
        K = Y 
        for(;;){
            K ++ 
            J --
            if(J < 0 || K > 7) break;
            const validBox = board.current[J][K]
            const isPathActivated = activateComputedPath(validBox,type)
            if(!isPathActivated) break
            else possiblePath.current.push(validBox)

        }
        J = X
        K = Y
        for(;;){
            J ++ 
            K --
            if(J > 7 || K < 0) break;
            const validBox = board.current[J][K]
            const isPathActivated = activateComputedPath(validBox,type)
            if(!isPathActivated) break
            else possiblePath.current.push(validBox)
        }
        J = X
        K = Y
        for(;;){
            J ++ 
            K ++ 
            if(J > 7 || K > 7) break;
            const validBox = board.current[J][K]
            const isPathActivated = activateComputedPath(validBox,type)
            if(!isPathActivated) break
            else possiblePath.current.push(validBox)
        }
    }

    function computePathForRook(X,Y,type){
                    for(let i = X  - 1;i >= 0;i--){
                        const validBox = board.current[i][Y]
                        const isPathActivated = activateComputedPath(validBox,type)
                        if(!isPathActivated) break
                        else possiblePath.current.push(validBox)
                    }

                    for(let i = X + 1 ; i <= 7 ; i++ ){
                        const validBox = board.current[i][Y]
                        const isPathActivated = activateComputedPath(validBox,type)
                        if(!isPathActivated) break
                        else possiblePath.current.push(validBox)

                    }

                    for(let i = Y - 1 ; i >= 0 ; i--){
                        const validBox = board.current[X][i]
                        const isPathActivated = activateComputedPath(validBox,type)
                        if(!isPathActivated) break
                        else possiblePath.current.push(validBox)

                    }

                    for(let i = Y  + 1; i <= 7 ; i++){
                        const validBox = board.current[X][i]
                        const isPathActivated = activateComputedPath(validBox,type)
                        if(!isPathActivated) break
                        else possiblePath.current.push(validBox)
                    }
    }

    function pawnMovement(X,Y,type){
        if(type === 'host'){
            if((X-1) >=0 ) possiblePath.current.push(board.current[X-1][Y])
            if((X-1) >=0 && (Y-1) >=0 ) possiblePath.current.push(board.current[X-1][Y-1])
            if((X-1) >=0 && (Y+1) <= 7) possiblePath.current.push(board.current[X-1][Y+1])
        }
        else if(type === 'remote'){
            if((X+1) <=7 ) possiblePath.current.push(board.current[X+1][Y])
            if((X+1) <=7 && (Y-1) >=0 ) possiblePath.current.push(board.current[X+1][Y-1])
            if((X+1) <=7 && (Y+1) <= 7) possiblePath.current.push(board.current[X+1][Y+1])
        }
            const frontPiece = possiblePath.current[0]
            const leftAngledPiece = possiblePath.current[1]
            const rightAngledPiece = possiblePath.current[2]
            if(frontPiece?.children.length === 0){
                frontPiece.classList.add('possible-path-bg')
                frontPiece.addEventListener('click',holdPiece)
            }
            if(leftAngledPiece?.children.length === 1 ){
                const pieceType = leftAngledPiece.children[0].dataset.type
                if(type === 'host'){
                    if(pieceType === 'remote'){
                        RenderPathAndAttahClickHandlerToPiece(leftAngledPiece)
                    }
                }
                else if(type === 'remote'){
                    if(pieceType === 'host'){
                        RenderPathAndAttahClickHandlerToPiece(leftAngledPiece)
                    }
                }
            }
            if(rightAngledPiece?.children.length === 1 ){
                const pieceType = rightAngledPiece.children[0].dataset.type
                if(type === 'host'){
                    if(pieceType === 'remote'){
                        RenderPathAndAttahClickHandlerToPiece(rightAngledPiece)
                    }
                }
                else if(type === 'remote'){
                    if(pieceType === 'host'){
                        RenderPathAndAttahClickHandlerToPiece(rightAngledPiece)
                    }
                }
            }
            function RenderPathAndAttahClickHandlerToPiece(piece){
                piece.classList.add('possible-path-bg')
                piece.children[0].removeEventListener('click',computePath)
                deactivatedPieces.current.push(piece.children[0])
                piece.addEventListener('click',holdPiece)
            }
    }

    function knightMovement(X,Y,type){
        if(X-2 >=0 && Y-1 >= 0){
            const validBox = board.current[X-2][Y-1]
            const isActivated = activateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
        } 
        if(X-2 >=0 && Y+1 <= 7){
            const validBox = board.current[X-2][Y+1]
            const isActivated = activateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
        }
        
        if(X+2 <=7 && Y-1 >= 0){
            const validBox = board.current[X+2][Y-1]
            const isActivated = activateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
            
        } 
        if(X+2 <=7 && Y+1 <= 7){
            const validBox = board.current[X+2][Y+1]
            const isActivated = activateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
        } 
        if(X-1 >=0 && Y-2 >= 0){
            const validBox = board.current[X-1][Y-2]
            const isActivated = activateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
        } 
        if(X-1 >=0 && Y+2 <= 7) {
            const validBox = board.current[X-1][Y+2] 
            const isActivated = activateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
        } 
        if(X+1 <=7 && Y-2 >= 0){
            const validBox = board.current[X+1][Y-2]
            const isActivated = activateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
        } 
        if(X+1 <=7 && Y+2 <= 7){
            const validBox = board.current[X+1][Y+2]
            const isActivated = activateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
            
        }

    }

    function kingMovement(X,Y,type){
        let J = X 
        let K = Y
        if((J-1) >= 0){
            const validBox = board.current[J-1][K]
            const isPathActivated = activateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
            
        } 
        if((J-1) >=0 && (K-1) >= 0){

            const validBox = board.current[J-1][K-1]
            const isPathActivated = activateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
            
        } 
        if((K-1) >= 0){
            const validBox = board.current[J][K-1]
            const isPathActivated = activateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
            
        } 
        if((J-1) >=0 && (K+1) <= 7){
            const validBox = board.current[J-1][K+1]
            const isPathActivated = activateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
        } 
        if((K+1) <= 7 ){
            const validBox = board.current[J][K+1]
            const isPathActivated = activateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
        } 
        if((J+1) <= 7 && (K-1) >= 0){
            const validBox = board.current[J+1][K-1]
            const isPathActivated = activateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
        }
        if((J+1) <= 7){
            const validBox = board.current[J+1][K]
            const isPathActivated = activateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
        } 
        if((J+1) <= 7 && (K+1) <= 7 ){
            const validBox = board.current[J+1][K+1]
            const isPathActivated = activateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
        } 
    }

    useEffect(()=>{
            buildPlayground()
    },[])
    // useEffect(()=>{
    //     console.log(matchState,'case# matchstate from chessboard component')
    // },[matchState])
    return(
        <div  id='playground' className='playground-wrapper'>
            <div id='opponent-id-container'>
            <span>
                    {matchState.isMatchStart && !matchState.isMatchFinished ? 
                    matchState.player1 !== me ? matchState.player1 + ' (opponent)': matchState.player2 + ' (opponent)' : ''}
                    {matchState.isMatchFinished ? matchState.msg : ''}
                </span>
            </div>
            <div id='inner-playground-wrapper'>
                <div className='inner-playground-wrapper-cover inactive-playground-cover'></div>
            </div>
            <div id='your-id-container'>
                <span>
                    {matchState.isMatchStart && !matchState.isMatchFinished ? me + ' (you)' : ''}
                </span>
            </div>
        </div>
    )
}
export default ChessBoard