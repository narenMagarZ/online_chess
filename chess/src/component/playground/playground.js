import { useEffect, useRef } from 'react'
import './playground.css'
import {LoadHostPieces,LoadRemotePieces} from './loadpieces'
import BK_PAWN  from '../pieces/remote_pieces/remote_pawn.svg'
import WH_PAWN from '../pieces/host_pieces/host_pawn.svg'
import { AddAttribute } from './utils/addattribute'

function Playground(){
    new WebSocket('ws://localhost:5000/')
    const playground = useRef(null)
    const possiblePath = useRef([])
    const activePiece = useRef(null)
    const deactivatedPieces = useRef([])
    const activePieceType = useRef('host')
    const playgroundCoordinate = useRef([
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        ])
    function BuildPlayground(){
        playground.current = document.getElementById('inner-playground-wrapper')
        if(playground.current){
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
                    playgroundCoordinate.current[row][col] = colWrapper
                    const pieceWrapperCord = JSON.stringify({X:row,Y:col})
                    colWrapper.setAttribute('data-cord',pieceWrapperCord)
                    if(row === 0 || row === 7 || row ===1 || row === 6){
                        const pieceWrapper = document.createElement('div')
                        pieceWrapper.addEventListener('click',ComputePossiblePath)
                        pieceWrapper.setAttribute('id','piece-wrapper')
                        const piece = document.createElement('img')
                        piece.setAttribute('id','piece')
                        pieceWrapper.setAttribute('data-cord',pieceWrapperCord)
                        if(row === 0){
                            const {id,val,type} = LoadRemotePieces()[col]
                            pieceWrapper.classList.add('inactive-piece')
                            AddAttribute(piece,pieceWrapper,id,type,val)
                        }
                        else if(row === 7){
                            const {id,val,type} = LoadHostPieces()[col]
                            pieceWrapper.classList.add('active-piece')
                            AddAttribute(piece,pieceWrapper,id,type,val)
                        }
                        else if(row === 1){
                            pieceWrapper.classList.add('inactive-piece')
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
                playground.current.appendChild(rowWrapper)
            }
        }
    }

    function ComputePossiblePath({target}){
        const {cord,id,type} = target.dataset
        const pieceWrapperCord = JSON.parse(cord)
        console.log(pieceWrapperCord,id,type)

        if(possiblePath.current.length > 0){
            const len = possiblePath.current.length
            for(let i = 0 ; i < len ;i++) {
                possiblePath.current[i].classList.remove('possible-path-bg')
                possiblePath.current[i].removeEventListener('click',AttachPiece)
                possiblePath.current[i] = []
            }
        }
        for(let i = 0 ; i < deactivatedPieces.current.length ; i++){
            console.log(deactivatedPieces.current[i],'these are deactivated ')
            deactivatedPieces.current[i].addEventListener('click',ComputePossiblePath)
        }
        deactivatedPieces.current = []
        possiblePath.current = []

        let {X,Y} = pieceWrapperCord
        X = parseInt(X)
        Y = parseInt(Y)
        activePiece.current = target
        if(type === 'host'){
            switch(id){
                case "pawn":
                    PawnMovement(X,Y,'host')
                    break;
                case "rook":
                    ComputePathForRook(X,Y,'host')
                    AttachClickHandlerToPiece()
                    break;
                case "knight":
                    KnightMovement(X,Y,'host')
                    AttachClickHandlerToPiece()
                    break;
                case "bishop":
                    ComputePathForBishop(X,Y,'host')
                    AttachClickHandlerToPiece()
                    break;
                case "queen":
                    ComputePathForRook(X,Y,'host')
                    ComputePathForBishop(X,Y,'host')
                    AttachClickHandlerToPiece()
                    break;
                case "king":
                    KingMovement(X,Y,'host')
                    AttachClickHandlerToPiece()
                    break;
                default :
                    break;
            }
        }
        else if(type === 'remote'){
            switch(id){
                case "pawn":
                    PawnMovement(X,Y,'remote')
                    break;
                case "rook":
                    ComputePathForRook(X,Y,'remote')
                    AttachClickHandlerToPiece()
                    break;
                case "knight":
                    KnightMovement(X,Y,'remote')
                    AttachClickHandlerToPiece()
                    break;
                case "bishop":
                    ComputePathForBishop(X,Y,'remote')
                    AttachClickHandlerToPiece()
                    break;
                case "queen":
                    ComputePathForRook(X,Y,'remote')
                    ComputePathForBishop(X,Y,'remote')
                    AttachClickHandlerToPiece()
                    break;
                case "king":
                    KingMovement(X,Y,'remote')
                    AttachClickHandlerToPiece()
                    break;
                default:
                    break;
            }
        }
    }


    
    function AttachPiece({target}){
        const {cord} = target.dataset
        const {X,Y} = JSON.parse(cord)
        const pieceWrapperCord = JSON.stringify({X,Y})
        activePiece.current.setAttribute('data-cord',pieceWrapperCord)
        const inactivatedPieces = document.querySelectorAll('.inactive-piece')
        const activatedPieces = document.querySelectorAll('.active-piece')
        console.log(deactivatedPieces.current,'from attach piece')
        if(target.children.length > 0){
            target.removeChild(target.children[0])
            target.appendChild(activePiece.current)
        }

        // if(target.children.length > 0){
        //     console.log(target.children,'these are target children')
        //     const targetParent = target.parentElement
        //     targetParent.removeChild(target)
        //     targetParent.appendChild(activePiece.current)
        // }
        else {
            target.appendChild(activePiece.current)
        }
        for(let pathIndex = 0 ; pathIndex < possiblePath.current.length ; pathIndex ++){
            possiblePath.current[pathIndex]?.classList.remove('possible-path-bg')
            possiblePath.current[pathIndex]?.removeEventListener('click',AttachPiece)
        }
  
        if(activePieceType.current === 'host'){
            inactivatedPieces.forEach((pieceWrapper)=>{
                pieceWrapper.classList.remove('inactive-piece')
                pieceWrapper.classList.add('active-piece')
            })
            activatedPieces.forEach((pieceWrapper)=>{
                pieceWrapper.classList.remove('active-piece')
                pieceWrapper.classList.add('inactive-piece')
            })
            activePieceType.current = 'remote'
        }
        else {
            inactivatedPieces.forEach((pieceWrapper)=>{
                pieceWrapper.classList.remove('inactive-piece')
                pieceWrapper.classList.add('active-piece')
            })
            activatedPieces.forEach((pieceWrapper)=>{
                pieceWrapper.classList.remove('active-piece')
                pieceWrapper.classList.add('inactive-piece')
                
            })
            activePieceType.current = 'host'
        }
        possiblePath.current= []

    }
    
    function AttachClickHandlerToPiece(){
        console.log(possiblePath.current,'these are my child bro')
        for(let i = 0 ;i<possiblePath.current.length ;i++){
            if(possiblePath.current[i].children.length > 0){
                possiblePath.current[i].children[0].removeEventListener('click',ComputePossiblePath)
                deactivatedPieces.current.push(possiblePath.current[i].children[0])
            }
            console.log(deactivatedPieces.current,'these are pushing state ')
            possiblePath.current[i].addEventListener('click',AttachPiece)
        }

    
    }


    function ActivateComputedPath(validBox,type){
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

    function ComputePathForBishop(X,Y,type){
        let J = X 
        let K = Y
        for(;;){
            K -- 
            J --
            if(J < 0 || K < 0) break;
            const validBox = playgroundCoordinate.current[J][K]
            const isPathActivated = ActivateComputedPath(validBox,type)
            if(!isPathActivated) break
            else possiblePath.current.push(validBox)
        }
        J = X 
        K = Y 
        for(;;){
            K ++ 
            J --
            if(J < 0 || K > 7) break;
            const validBox = playgroundCoordinate.current[J][K]
            const isPathActivated = ActivateComputedPath(validBox,type)
            if(!isPathActivated) break
            else possiblePath.current.push(validBox)

        }
        J = X
        K = Y
        for(;;){
            J ++ 
            K --
            if(J > 7 || K < 0) break;
            const validBox = playgroundCoordinate.current[J][K]
            const isPathActivated = ActivateComputedPath(validBox,type)
            if(!isPathActivated) break
            else possiblePath.current.push(validBox)
        }
        J = X
        K = Y
        for(;;){
            J ++ 
            K ++ 
            if(J > 7 || K > 7) break;
            const validBox = playgroundCoordinate.current[J][K]
            const isPathActivated = ActivateComputedPath(validBox,type)
            if(!isPathActivated) break
            else possiblePath.current.push(validBox)
        }
    }

    function ComputePathForRook(X,Y,type){
                    for(let i = X  - 1;i >= 0;i--){
                        const validBox = playgroundCoordinate.current[i][Y]
                        const isPathActivated = ActivateComputedPath(validBox,type)
                        if(!isPathActivated) break
                        else possiblePath.current.push(validBox)
                    }

                    for(let i = X + 1 ; i <= 7 ; i++ ){
                        const validBox = playgroundCoordinate.current[i][Y]
                        const isPathActivated = ActivateComputedPath(validBox,type)
                        if(!isPathActivated) break
                        else possiblePath.current.push(validBox)

                    }

                    for(let i = Y - 1 ; i >= 0 ; i--){
                        const validBox = playgroundCoordinate.current[X][i]
                        const isPathActivated = ActivateComputedPath(validBox,type)
                        if(!isPathActivated) break
                        else possiblePath.current.push(validBox)

                    }

                    for(let i = Y  + 1; i <= 7 ; i++){
                        const validBox = playgroundCoordinate.current[X][i]
                        const isPathActivated = ActivateComputedPath(validBox,type)
                        if(!isPathActivated) break
                        else possiblePath.current.push(validBox)
                    }
    }


    function PawnMovement(X,Y,type){
        if(type === 'host'){
            if((X-1) >=0 ) possiblePath.current.push(playgroundCoordinate.current[X-1][Y])
            if((X-1) >=0 && (Y-1) >=0 ) possiblePath.current.push(playgroundCoordinate.current[X-1][Y-1])
            if((X-1) >=0 && (Y+1) <= 7) possiblePath.current.push(playgroundCoordinate.current[X-1][Y+1])
        }
        else if(type === 'remote'){
            if((X+1) <=7 ) possiblePath.current.push(playgroundCoordinate.current[X+1][Y])
            if((X+1) <=7 && (Y-1) >=0 ) possiblePath.current.push(playgroundCoordinate.current[X+1][Y-1])
            if((X+1) <=7 && (Y+1) <= 7) possiblePath.current.push(playgroundCoordinate.current[X+1][Y+1])
        }
            const frontPiece = possiblePath.current[0]
            const leftAngledPiece = possiblePath.current[1]
            const rightAngledPiece = possiblePath.current[2]
            if(frontPiece?.children.length === 0){
                frontPiece.classList.add('possible-path-bg')
                frontPiece.addEventListener('click',AttachPiece)
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
                piece.children[0].removeEventListener('click',ComputePossiblePath)
                deactivatedPieces.current.push(piece.children[0])
                piece.addEventListener('click',AttachPiece)
            }
    }


    function KnightMovement(X,Y,type){
        if(X-2 >=0 && Y-1 >= 0){
            const validBox = playgroundCoordinate.current[X-2][Y-1]
            const isActivated = ActivateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
        } 
        if(X-2 >=0 && Y+1 <= 7){
            const validBox = playgroundCoordinate.current[X-2][Y+1]
            const isActivated = ActivateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
        }
        
        if(X+2 <=7 && Y-1 >= 0){
            const validBox = playgroundCoordinate.current[X+2][Y-1]
            const isActivated = ActivateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
            
        } 
        if(X+2 <=7 && Y+1 <= 7){
            const validBox = playgroundCoordinate.current[X+2][Y+1]
            const isActivated = ActivateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
        } 
        if(X-1 >=0 && Y-2 >= 0){
            const validBox = playgroundCoordinate.current[X-1][Y-2]
            const isActivated = ActivateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
        } 
        if(X-1 >=0 && Y+2 <= 7) {
            const validBox = playgroundCoordinate.current[X-1][Y+2] 
            const isActivated = ActivateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
        } 
        if(X+1 <=7 && Y-2 >= 0){
            const validBox = playgroundCoordinate.current[X+1][Y-2]
            const isActivated = ActivateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
        } 
        if(X+1 <=7 && Y+2 <= 7){
            const validBox = playgroundCoordinate.current[X+1][Y+2]
            const isActivated = ActivateComputedPath(validBox,type)
            if(isActivated) possiblePath.current.push(validBox)
            
        }

    }

    function KingMovement(X,Y,type){
        let J = X 
        let K = Y
        if((J-1) >= 0){
            const validBox = playgroundCoordinate.current[J-1][K]
            const isPathActivated = ActivateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
            
        } 
        if((J-1) >=0 && (K-1) >= 0){

            const validBox = playgroundCoordinate.current[J-1][K-1]
            const isPathActivated = ActivateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
            
        } 
        if((K-1) >= 0){
            const validBox = playgroundCoordinate.current[J][K-1]
            const isPathActivated = ActivateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
            
        } 
        if((J-1) >=0 && (K+1) <= 7){
            const validBox = playgroundCoordinate.current[J-1][K+1]
            const isPathActivated = ActivateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
        } 
        if((K+1) <= 7 ){
            const validBox = playgroundCoordinate.current[J][K+1]
            const isPathActivated = ActivateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
        } 
        if((J+1) <= 7 && (K-1) >= 0){
            const validBox = playgroundCoordinate.current[J+1][K-1]
            const isPathActivated = ActivateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
        }
        if((J+1) <= 7){
            const validBox = playgroundCoordinate.current[J+1][K]
            const isPathActivated = ActivateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
        } 
        if((J+1) <= 7 && (K+1) <= 7 ){
            const validBox = playgroundCoordinate.current[J+1][K+1]
            const isPathActivated = ActivateComputedPath(validBox,type)
            if(isPathActivated) possiblePath.current.push(validBox)
        } 
    }

    useEffect(()=>{
        BuildPlayground()
        console.log(playgroundCoordinate.current)
    },[])
    return(
        <div  id='playground' className='playground-wrapper'>
            <div id='inner-playground-wrapper'>

            </div>
        </div>
    )
}
export default Playground