angular.module('buzzer', [
])

.factory('buzzer', ['$timeout', function($timeout){

  var buzzer = {};

  var context = new webkitAudioContext(),
      osc,
      analyser;

  var sound = {};
  
  sound.play = function(frequency) {

    osc = context.createOscillator();
    analyser = context.createAnalyser();

    osc.connect(analyser);
    analyser.connect(context.destination);

    osc.frequency.value = frequency;

    osc.start(0);
  };

  sound.stop = function() {
    osc.stop(0);
  };



  buzzer.test = function() {
    sound.play(523);
  };

  buzzer.warning = function() {

    var isPlaying = false, count = 5, warningTimeout;

    var warningCB = function(){

      if(isPlaying){
        sound.stop();
        isPlaying = false;
      } else {
        sound.play(261);
        isPlaying = true;
      }

      if(count !== 0)
        warningTimeout = $timeout(warningCB, 150);

      count--;
    };

    warningCB();

  };

  buzzer.ending = function() {

    var isPlaying = false, count = 1, endingTimeout;

    var endingCB = function(){

      if(isPlaying){
        sound.stop();
        isPlaying = false;
      } else {
        sound.play(220);
        isPlaying = true;
      }

      if(count !== 0)
        endingTimeout = $timeout(endingCB, 350);

      count--;
    };

    endingCB();
  };
  
  buzzer.finish = function() {

    var isPlaying = false, count = 3, finishTimeout;

    var finishCB = function(){

      if(isPlaying){
        sound.stop();
        isPlaying = false;
      } else {

        if(count === 3)
          sound.play(220);

        if(count === 1)
          sound.play(261);

        isPlaying = true;
      }

      if(count !== 0)
        finishTimeout = $timeout(finishCB, 350);

      count--;
    };

    finishCB();
  };

  return buzzer;

}]);

