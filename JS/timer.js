let elapsedTime = 0; //stores time
let intervalID = null; //know when the time interval actually running
const timerDisplay = document.querySelector("#timer"); //display the actual time. 

function updateTimer()
{
    if (!timerDisplay)
    {
        return;
    }
    //1 min = 60 seconds
    const minutes = Math.floor(elapsedTime/60);
    const seconds = elapsedTime%60;

    timerDisplay.textContent = 
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
export function timeStart()
{
    if (intervalID!== null)
    {
        return;
    }
    intervalID = setInterval(()=>{
    elapsedTime = elapsedTime + 1;
    updateTimer();},1000); //1000ms = 1 second.
}

//pause the time, then call timestart will resume from where we stop
export function pause()
{
    if (intervalID !== null)
    {
        clearInterval(intervalID);
        intervalID = null;
    }
}
//reset time to 00:00 once new game start. 
export function reset()
{
    //stops the timer if is running
    if (intervalID !== null) 
    {
        clearInterval(intervalID);
        intervalID = null;
    }
    elapsedTime = 0;
    updateTimer();
}

//grabs the time when people left the page. 
export function getTime()
{
    return elapsedTime;
}

//display details of timer. 
export function restoreTime(times)
{
    if (!Number.isInteger(times) || times < 0)
    {
        return false;
    }
    pause();
    elapsedTime = times;
    updateTimer();
    return true;
}