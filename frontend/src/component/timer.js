import '../assets/style/timer.css'
export default function Timer({matchState}){
    return(
        <div className="timer-container">
            <div>
                <span>
                    {matchState.timerValue}
                </span>
            </div>
        </div>
    )
}