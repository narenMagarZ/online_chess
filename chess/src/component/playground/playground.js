import { useEffect, useRef } from 'react'
import './playground.css'
import {LoadHostPieces,LoadRemotePieces} from './loadpieces'
import BK_PAWN  from '../pieces/remote_pieces/remote_pawn.svg'
import WH_PAWN from '../pieces/host_pieces/host_pawn.svg'
import { AddAttribute } from './utils/addattribute'

function Playground(){
    const playground = useRef(null)
    const possiblePath = useRef([])
    const activePiece = useRef(null)
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
                            AddAttribute(piece,pieceWrapper,id,type,val)
                        }
                        else if(row === 7){
                            const {id,val,type} = LoadHostPieces()[col]
                            AddAttribute(piece,pieceWrapper,id,type,val)
                        }
                        else if(row === 1) AddAttribute(piece,pieceWrapper,'pawn','remote',BK_PAWN)
                        else if(row === 6) AddAttribute(piece,pieceWrapper,'pawn','host',WH_PAWN)
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
        possiblePath.current = []
        let {X,Y} = pieceWrapperCord
        X = parseInt(X)
        Y = parseInt(Y)
        let J = 0
        let K = 0
        activePiece.current = target
        if(type === 'host'){
            switch(id){
                case "pawn":
                    if((X-1) >=0 ) possiblePath.current.push(playgroundCoordinate.current[X-1][Y])
                    if((X-1) >=0 && (Y-1) >=0 ) possiblePath.current.push(playgroundCoordinate.current[X-1][Y-1])
                    if((X-1) >=0 && (Y+1) <= 7) possiblePath.current.push(playgroundCoordinate.current[X-1][Y+1])
                    const frontPiece = possiblePath.current[0]
                    const leftAngledPiece = possiblePath.current[1]
                    const rightAngledPiece = possiblePath.current[2]
                    if(frontPiece?.children.length === 0){
                        frontPiece.classList.add('possible-path-bg')
                        frontPiece.addEventListener('click',AttachPiece)
                    }
                    if(leftAngledPiece?.children.length === 1){
                        console.log(leftAngledPiece.children[0])
                        const pieceType = leftAngledPiece.children[0].dataset.type
                        if(pieceType === 'remote'){
                            leftAngledPiece.classList.add('possible-path-bg')
                            console.log(leftAngledPiece.children,'this is left angled piece')
                            leftAngledPiece.children[0].removeEventListener('click',ComputePossiblePath)
                            leftAngledPiece.addEventListener('click',AttachPiece)
                        }
                    }
                    if(rightAngledPiece?.children.length === 1){
                        console.log(rightAngledPiece.children[0])
                        const pieceType = rightAngledPiece.children[0].dataset.type
                        if(pieceType === 'remote'){
                            rightAngledPiece.classList.add('possible-path-bg')
                            console.log(rightAngledPiece.children,'this is right angled piece')
                            rightAngledPiece.children[0].removeEventListener('click',ComputePossiblePath)
                            rightAngledPiece.addEventListener('click',AttachPiece)  
                        }
                    }
                    break;
                case "rook":
                    ComputePathForRook(X,Y)
                    console.log(possiblePath.current)
                    for(let i = 0 ;i<possiblePath.current.length ;i++){
                        possiblePath.current[i].addEventListener('click',AttachPiece)
                    }
                    break;
                case "knight":
                    if(X-2 >=0 && Y-1 >= 0) possiblePath.current.push(playgroundCoordinate.current[X-2][Y-1])
                    if(X-2 >=0 && Y+1 <= 7) possiblePath.current.push(playgroundCoordinate.current[X-2][Y+1])
                    if(X+2 <=7 && Y-1 >= 0) possiblePath.current.push(playgroundCoordinate.current[X+2][Y-1])
                    if(X+2 <=7 && Y+1 <= 7) possiblePath.current.push(playgroundCoordinate.current[X+2][Y+1])
                    if(X-1 >=0 && Y-2 >= 0) possiblePath.current.push(playgroundCoordinate.current[X-1][Y-2])
                    if(X-1 >=0 && Y+2 <= 7) possiblePath.current.push(playgroundCoordinate.current[X-1][Y+2])
                    if(X+1 <=7 && Y-2 >= 0) possiblePath.current.push(playgroundCoordinate.current[X+1][Y-2])
                    if(X+1 <=7 && Y+2 <= 7) possiblePath.current.push(playgroundCoordinate.current[X+1][Y+2])
                    console.log(possiblePath.current)
                    break;
                case "bishop":
                    ComputePathForBishop(X,Y)
                    console.log(possiblePath.current)
                    for(let i = 0 ;i<possiblePath.current.length ;i++){
                        possiblePath.current[i].addEventListener('click',AttachPiece)
                    }
                    break;
                case "queen":
                    ComputePathForRook(X,Y)
                    ComputePathForBishop(X,Y)
                    console.log(possiblePath.current)
                    break;
                case "king":
                    J = X 
                    K = Y
                    if((J-1) >= 0) possiblePath.current.push(playgroundCoordinate.current[J-1][K])
                    if((J-1) >=0 && (K-1) >= 0) possiblePath.current.push(playgroundCoordinate.current[J-1][K-1])
                    if((K-1) >= 0) possiblePath.current.push(playgroundCoordinate.current[J][K-1])
                    if((J-1) >=0 && (K+1) <= 7) possiblePath.current.push(playgroundCoordinate.current[J-1][K+1])
                    if((K+1) <= 7 ) possiblePath.current.push(playgroundCoordinate.current[J][K+1])
                    if((J+1) <= 7 && (K-1) >= 0) possiblePath.current.push(playgroundCoordinate.current[J+1][K-1])
                    if((J+1) <= 7) possiblePath.current.push(playgroundCoordinate.current[J+1][K])
                    if((J+1) <= 7 && (K+1) <= 7 ) possiblePath.current.push(playgroundCoordinate.current[J+1][K+1])
                    console.log(possiblePath.current)
                    break;
                default :
                    break;
            }
        }
        else if(type === 'remote'){

        }



    }


    
    function AttachPiece({target}){
        const {cord} = target.dataset
        const {X,Y} = JSON.parse(cord)
        const pieceWrapperCord = JSON.stringify({X,Y})
        activePiece.current.setAttribute('data-cord',pieceWrapperCord)
        if(target.children.length > 0){
            const targetParent = target.parentElement
            targetParent.removeChild(target)
            targetParent.appendChild(activePiece.current)
        }
        else {
            target.appendChild(activePiece.current)
        }
        for(let pathIndex = 0 ; pathIndex < possiblePath.current.length ; pathIndex ++){
            possiblePath.current[pathIndex]?.classList.remove('possible-path-bg')
            possiblePath.current[pathIndex]?.removeEventListener('click',AttachPiece)
        }
        possiblePath.current= []
    }

    function ActivateComputedPath(validBox){
        if(validBox.children.length > 0) {
            if(validBox.children[0]?.dataset.type === 'host') return false
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

    function ComputePathForBishop(X,Y){
        let J = X 
        let K = Y


  

        for(;;){
            K -- 
            J --
            if(J < 0 || K < 0) break;
            const validBox = playgroundCoordinate.current[J][K]
            const isPathActivated = ActivateComputedPath(validBox)
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
            const isPathActivated = ActivateComputedPath(validBox)
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
            const isPathActivated = ActivateComputedPath(validBox)
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
            const isPathActivated = ActivateComputedPath(validBox)
            if(!isPathActivated) break
            else possiblePath.current.push(validBox)
        }
    }

    function ComputePathForRook(X,Y){

                    // for up
                    for(let i = X  - 1;i >= 0;i--){
                        const validBox = playgroundCoordinate.current[i][Y]
                        const isPathActivated = ActivateComputedPath(validBox)
                        if(!isPathActivated) break
                        else possiblePath.current.push(validBox)
                    }

                    // for down 
                    for(let i = X + 1 ; i <= 7 ; i++ ){
                        const validBox = playgroundCoordinate.current[i][Y]
                        const isPathActivated = ActivateComputedPath(validBox)
                        if(!isPathActivated) break
                        else possiblePath.current.push(validBox)

                    }

                    // for left 
                    for(let i = Y - 1 ; i >= 0 ; i--){
                        const validBox = playgroundCoordinate.current[X][i]
                        const isPathActivated = ActivateComputedPath(validBox)
                        if(!isPathActivated) break
                        else possiblePath.current.push(validBox)

                    }

                    // for right 
                    for(let i = Y  + 1; i <= 7 ; i++){
                        const validBox = playgroundCoordinate.current[X][i]
                        const isPathActivated = ActivateComputedPath(validBox)
                        if(!isPathActivated) break
                        else possiblePath.current.push(validBox)
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