import Link from 'next/link'
import React from 'react'
import BufferLoader from '../lib/bufferloader'
import {autoCorrelate, getUserMedia, gotStream} from '../lib/audio'

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
  analyser.getFloatTimeDomainData(buf);
  var ac = autoCorrelate(buf, 44100);

  if (ac == -1) {

  } else {
    var note = noteFromPitch(ac);
    note = noteStrings[note%12];
  }

  rafID = window.requestAnimationFrame( updatePitch.bind(this, audioContext, analyser) );
}


export default class Game extends React.Component {
  state = {
    "leftHand": "up",
    "rightHand": "up"
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
      gotStream(this.audioCtx, updatePitch)
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

        // setTimeout(() => {this.playSong1();}, 30);
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

  judgement() {
    console.log("judging");
    recording = [];

    setTimeout(() => {this.finalJudgement()}, 3000);
  }

  finalJudgement() {
    var normalizedTiming;
    var first = recording[0];

    var song = [0, 0.5*quarterNoteTime, 1*quarterNoteTime, 1.5*quarterNoteTime, 2*quarterNoteTime, 2.5*quarterNoteTime, 3*quarterNoteTime];

    normalizedTiming = recording.map((x) => {
      return x - first;
    });

    console.log('song:', song);
    console.log('yourtime:', normalizedTiming);

    var difference = song.map((x, i) => {
      return 1 - Math.abs(x - normalizedTiming[i]);
    });

    console.log('difference:', difference);
  }

  playSong1() {
    var startTime = this.audioCtx.currentTime + 0.100;

    this.playLeftBongo(startTime);
    this.playLeftBongo(startTime + 0.5*quarterNoteTime);

    this.playRightBongo(startTime + quarterNoteTime);
    this.playRightBongo(startTime + 1.5*quarterNoteTime);

    this.playLeftBongo(startTime + 2*quarterNoteTime);
    this.playLeftBongo(startTime + 2.5*quarterNoteTime);

    this.playRightBongo(startTime + 3*quarterNoteTime);

    setTimeout(() => {this.judgement()}, 1800);
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

      <Link href="/">
        <a>Back</a>
      </Link>
    </div>
   )
  }
}
