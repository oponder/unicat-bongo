export function getUserMedia(dictionary, callback) {
  try {
    navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
    navigator.getUserMedia(dictionary, callback, () => { alert('Stream generation failed.'); });
  } catch (e) {
    alert('getUserMedia threw exception :' + e);
  }
}

export function gotStream(audioContext, pitchCallBack, volumeCallback) {
  return function(stream) {
    // Create an AudioNode from the stream.
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Connect it to the destination.
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect( analyser );

    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    var meter = createAudioMeter(audioContext, volumeCallback);
    mediaStreamSource.connect(meter);

    pitchCallBack(audioContext, analyser);
  }
}

var MIN_SAMPLES = 4;  // will be initialized when AudioContext is created.
var GOOD_ENOUGH_CORRELATION = 0.9; // this is the "bar" for how close a correlation needs to be

export function autoCorrelate( buf, sampleRate ) {
  var SIZE = buf.length;
  var MAX_SAMPLES = Math.floor(SIZE/2);
  var best_offset = -1;
  var best_correlation = 0;
  var rms = 0;
  var foundGoodCorrelation = false;
  var correlations = new Array(MAX_SAMPLES);

  for (var i=0;i<SIZE;i++) {
    var val = buf[i];
    rms += val*val;
  }
  rms = Math.sqrt(rms/SIZE);
  if (rms<0.01) // not enough signal
    return -1;

  var lastCorrelation=1;
  for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
    var correlation = 0;

    for (var i=0; i<MAX_SAMPLES; i++) {
      correlation += Math.abs((buf[i])-(buf[i+offset]));
    }
    correlation = 1 - (correlation/MAX_SAMPLES);
    correlations[offset] = correlation; // store it, for the tweaking we need to do below.
    if ((correlation>GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
      foundGoodCorrelation = true;
      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    } else if (foundGoodCorrelation) {
      // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
      // Now we need to tweak the offset - by interpolating between the values to the left and right of the
      // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
      // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
      // (anti-aliased) offset.

      // we know best_offset >=1,
      // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
      // we can't drop into this clause until the following pass (else if).
      var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];
      return sampleRate/(best_offset+(8*shift));
    }
    lastCorrelation = correlation;
  }
  if (best_correlation > 0.01) {
    return sampleRate/best_offset;
  }
  return -1;
}


function createAudioMeter(audioContext,volumeCallback,clipLevel,averaging,clipLag) {
  var processor = audioContext.createScriptProcessor(512);
  processor.onaudioprocess = volumeAudioProcess(volumeCallback);
  processor.clipping = false;
  processor.lastClip = 0;
  processor.volume = 0;
  processor.clipLevel = clipLevel || 0.5;
  processor.averaging = averaging || 0.95;
  processor.clipLag = clipLag || 750;

  // this will have no effect, since we don't copy the input to the output,
  // but works around a current Chrome bug.
  processor.connect(audioContext.destination);

  processor.checkClipping =
    function(){
      if (!this.clipping)
        return false;
      if ((this.lastClip + this.clipLag) < window.performance.now())
        this.clipping = false;
      return this.clipping;
    };

  processor.shutdown =
    function(){
      this.disconnect();
      this.onaudioprocess = null;
    };

  return processor;
}

function volumeAudioProcess( volumeCallback) {
  return function(event){
  var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
  var sum = 0;
    var x;

  // Do a root-mean-square on the samples: sum up the squares...
    for (var i=0; i<bufLength; i++) {
      x = buf[i];
      if (Math.abs(x)>=this.clipLevel) {
        this.clipping = true;
        this.lastClip = window.performance.now();
      }
      sum += x * x;
    }

    // ... then take the square root of the sum.
    var rms =  Math.sqrt(sum / bufLength);

    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    if (this.volume > 0.6) {
      volumeCallback(this.volume);
    }
    this.volume = Math.max(rms, this.volume*this.averaging);
    }
}
