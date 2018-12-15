import Link from 'next/link'
import React from 'react'
import BufferLoader from '../lib/bufferloader'
import {autoCorrelate, getUserMedia, gotStream, createAudioMeter} from '../lib/audio'

var ESCAPE_KEY = 27;
var context;

var tempo = 120; // BPM (beats per minute)
var quarterNoteTime = 60 / tempo;
var song = [];
var recording = [];

var buflen = 1024;
var buf = new Float32Array( buflen );
var rafID;

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function noteFromPitch( frequency ) {
  var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
  return Math.round( noteNum ) + 69;
}

function updatePitch(audioContext, analyser) {
  if (!this.state.streamAcquired) {
    this.setState({"streamAcquired":  true});
  }
  analyser.getFloatTimeDomainData(buf);
  var ac = autoCorrelate(buf, 44100);

  if (ac == -1) {

  } else {
    // var note = noteFromPitch(ac);
    // note = noteStrings[note%12];
    // this.setState({"currentPitch": ac});
  }

  rafID = window.requestAnimationFrame( updatePitch.bind(this, audioContext, analyser) );
}

function handleSound(volume) {
  setTimeout(() => { this.setState({'leftHand': 'down'}) }, 0);
  setTimeout(() => { this.setState({'leftHand': 'up'}) }, 100);
  this.setState({'lastPitch': this.state.currentPitch});
  recording.push(this.audioCtx.currentTime);
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export default class Game extends React.Component {
  state = {
    "leftHand": "up",
    "rightHand": "up",
    "streamAcquired": false,
    "ready": false,
    "judging": false,
    "level": 1,
    "result": "",
    "playing": false
  }

  componentDidMount() {
    const audioCtx = new AudioContext();
    this.audioCtx = audioCtx;

    // Get User Media and start tracking pitch events.
    getUserMedia(
      {
        "audio": {
          "mandatory": {
            "googEchoCancellation": "false",
            "googAutoGainControl": "false",
            "googNoiseSuppression": "false",
            "googHighpassFilter": "false"
          },
          "optional": []
        },
      },
      gotStream(this.audioCtx, updatePitch.bind(this), debounce(handleSound.bind(this), 40, true))
    );


    // Start loading the drum kit.
    this.bufferLoader = new BufferLoader(
      this.audioCtx,
      [
      "/static/sounds/bongo0.mp3",
      "/static/sounds/bongo1.mp3",
      ],
      () => {
        // Sounds are loaded, game is ready.
        this.bongo0 = this.bufferLoader.bufferList[0];
        this.bongo1 = this.bufferLoader.bufferList[1];

        this.setState({"ready": true})
      }
    );

    this.bufferLoader.load();

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleKeyDown() {
    recording.push(this.audioCtx.currentTime);
  }

  playSound(buffer, time) {
    var source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioCtx.destination);
    source.start(time);
  }

  playLeftBongo(time) {
    var source = this.audioCtx.createBufferSource();
    source.buffer = this.bongo0;
    source.connect(this.audioCtx.destination);
    source.start(time);
    var time = time - this.audioCtx.currentTime;
    setTimeout(() => { this.setState({'leftHand': 'down'}) }, time*1000);
    setTimeout(() => { this.setState({'leftHand': 'up'}) }, time*1100);
  }

  playRightBongo(time) {
    var source = this.audioCtx.createBufferSource();
    source.buffer = this.bongo1;
    source.connect(this.audioCtx.destination);
    source.start(time);
    var time = time - this.audioCtx.currentTime;
    setTimeout(() => { this.setState({'rightHand': 'down'}) }, time*1000);
    setTimeout(() => { this.setState({'rightHand': 'up'}) }, time*1100);
  }

  startJudging() {
    console.log("judging");
    this.setState({"judging": true})
    recording = [];

    setTimeout(() => {this.finishJudging()}, 3000);
  }

  finishJudging() {
    var normalizedTiming;
    var first = recording[0];

    var song = [0, 0.5*quarterNoteTime, 1*quarterNoteTime, 1.5*quarterNoteTime, 2*quarterNoteTime, 2.5*quarterNoteTime, 3*quarterNoteTime];

    normalizedTiming = recording.map((x) => {
      return x - first;
    });

    console.log('song:', song);
    console.log('yourtime:', normalizedTiming);

    var difference = song.map((x, i) => {
      if (isNaN(normalizedTiming[i])) {
        return 0;
      }
      return 1 - Math.abs(x - normalizedTiming[i]);
    });

    console.log('difference:', difference);

    var score = 0;
    var sum = difference.reduce((a,b) => {return a+b}, 0);
    score = Math.round((sum / song.length) * 100);

    this.setState({
      'score': score,
      'result': this.scoreInterpretation(score),
      'judging': false,
      'playing': false
    });
  }

  playSong1() {
    var startTime = this.audioCtx.currentTime + 0.100;
    var songDuration = 1800;
    this.setState({
      "playing": true,
      "result": "",
    });

    this.playLeftBongo(startTime);
    this.playLeftBongo(startTime + 0.5*quarterNoteTime);

    this.playRightBongo(startTime + quarterNoteTime);
    this.playRightBongo(startTime + 1.5*quarterNoteTime);

    this.playLeftBongo(startTime + 2*quarterNoteTime);
    this.playLeftBongo(startTime + 2.5*quarterNoteTime);

    this.playRightBongo(startTime + 3*quarterNoteTime);

    setTimeout(() => {this.startJudging()}, songDuration);
  }

  scoreInterpretation(score) {
    if (score > 90) {
      this.setState({"levelCleared": true});
      return "REALLY GOOD!"
    } else if (score > 80) {
      this.setState({"levelCleared": true});
      return "NICE, BUT COULD BE BETTER"
    } else if (score > 50) {
      return "I THINK IT SOUNDED KINDA THE SAME? TRY AGAIN!"
    } else {
      return "THAT SOUNDED NOTHING LIKE WHAT I DID! TRY AGAIN!"
    }
  }

  nextLevel() {
    tempo += 20;
    quarterNoteTime = 60 / tempo;
    this.setState({
      score: 0,
      level: this.state.level + 1,
      result: '',
      playing: false,
      levelCleared: false
    });
  }

  render() {
   return(
    <div>
      <style>{`
        .down {
          background-color: #f00
        }`}
      </style>
      <p>This is the game page</p>

      <p className={this.state.leftHand}>boop</p>
      <p className={this.state.rightHand}>boop</p>

      {
        this.state.streamAcquired && this.state.ready ?
          !this.state.playing ?
            !this.state.levelCleared ?
              <button onClick={this.playSong1.bind(this)}>START</button>
            :
              ""
          :
           ""
        :
        "Waiting for assets and microphone permissions."
      }
      <br/>

      <div className="judging">
        { this.state.judging ? "I AM JUDGING NOW" : ""}
      </div>

      <div className="result">
        { this.state.result }
      </div>

      <div className="level">
        Level: { this.state.level }
      </div>

      {
        this.state.score > 80 ?
        <button onClick={this.nextLevel.bind(this)}>NEXT LEVEL</button>
        :
        ""
      }

      <Link href="/">
        <a>Back</a>
      </Link>
    </div>
   )
  }
}
