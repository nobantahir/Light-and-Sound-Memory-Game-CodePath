//Global Constants
const clueHoldTime = 1000; //time to hold light/sound in milliseconds
const cluePauseTime = 333; // time to pause between clues
const nextClueWaitTime = 1000; //time to wait before starting clue playback

//Global Variables
var pattern = [2, 2, 1, 4, 4, 3, 1, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //can be between 0.0 and 1.0
var guessCounter = 0;

function startGame(){
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame(){
  //end the game
  gamePlaying = false;
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 221,
  2: 321,
  3: 390,
  4: 468
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}

function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

//function for gameplay code 
function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }

  //game logic
  if(pattern[guessCounter] == btn){
    //correct, continue
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        //checking if completed pattern by comparing counter to length of pattern
        //when reaches end, player wins
        winGame();
      }else{
        //if player didn't win then progress counter continues and clue sequence replayed for next step
        progress++;
        playClueSequence();
      }
    }else{
        //check next guess when progressing
        guessCounter++;
      }
  }else{
    //if guess not correct then user loses and game ends
    loseGame();
  }
}