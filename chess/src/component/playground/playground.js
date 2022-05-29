import { useEffect, useRef } from 'react'
import './playground.css'
import {LoadHostPieces,LoadRemotePieces} from './loadpieces'
import BK_PAWN  from '../pieces/remote_pieces/remote_pawn.svg'
import WH_PAWN from '../pieces/host_pieces/host_pawn.svg'

function Playground(){
    const playground = useRef(null)
    const possiblePath = useRef([])
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
                        colWrapper.style.background = "#359e76"
                        backgroundCover = true
                    }
                    else {
                        colWrapper.style.background = "transparent"
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
                            piece.setAttribute('src',val)
                            pieceWrapper.setAttribute('data-id',id)
                            pieceWrapper.setAttribute('data-type',type)
                        }
                        else if(row === 7){
                            const {id,val,type} = LoadHostPieces()[col]
                            piece.setAttribute('src',val)
                            pieceWrapper.setAttribute('data-id',id)
                            pieceWrapper.setAttribute('data-type',type)
                        }
                        else if(row === 1){
                            piece.setAttribute('src',BK_PAWN)
                            pieceWrapper.setAttribute('data-id','pawn')
                            pieceWrapper.setAttribute('data-type','remote')
                        }
                        else if(row === 6){
                            piece.setAttribute('src',WH_PAWN)
                            pieceWrapper.setAttribute('data-id','pawn')
                            pieceWrapper.setAttribute('data-type','host')
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
        let {X,Y} = pieceWrapperCord
        X = parseInt(X)
        Y = parseInt(Y)
        if(type === 'host'){
            switch(id){
                case "pawn":
                    possiblePath.current.push(playgroundCoordinate.current[X-1][Y])
                    possiblePath.current.push(playgroundCoordinate.current[X-1][Y-1])
                    possiblePath.current.push(playgroundCoordinate.current[X-1][Y+1])

                    for(let pathIndex = 0 ; pathIndex < possiblePath.current.length ; pathIndex ++){
                        console.log(possiblePath.current[pathIndex])
                        console.log(possiblePath.current[pathIndex].children.length)
                        const isValidPath = possiblePath.current[pathIndex].children.length
                        if(isValidPath === 0){
                            possiblePath.current[pathIndex].style.background = "#0000001f"
                        }
                    }
                    break;
                case "rook":
                    break;
                case "knight":
                    break;
                case "bishop":
                    break;
                case "queen":
                    break;
                case "king":
                    break;
                default :
                    break;
            }
        }
        else if(type === 'remote'){

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