import { useEffect, useRef } from 'react'
import './playground.css'

function Playground(){
    const playground = useRef(null)
    function BuildPlayground(){
        playground.current = document.getElementById('inner-playground-wrapper')

        if(playground.current){
            console.log(playground.current)
            for(let row = 0 ; row < 8 ; row ++){
                const rowWrapper = document.createElement('div')
                rowWrapper.setAttribute('id','row-wrapper')
                for (let col = 0 ; col < 8 ; col ++ ){
                    const colWrapper = document.createElement('div')
                    colWrapper.setAttribute('id','col-wrapper')
                    rowWrapper.appendChild(colWrapper)
                }
                playground.current.appendChild(rowWrapper)
            }
        }
    }
    useEffect(()=>{
        BuildPlayground()
    },[])
    return(
        <div  id='playground' className='playground-wrapper'>
            <div id='inner-playground-wrapper'>

            </div>
        </div>
    )
}
export default Playground