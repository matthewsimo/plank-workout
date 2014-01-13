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
        finishTimeout = $timeout(finishCB, 150);
      } else {

        if(count === 3) {
          sound.play(220);
          finishTimeout = $timeout(finishCB, 150);
        }

        if(count === 1) {
          sound.play(293);
          finishTimeout = $timeout(finishCB, 500);
        }

        isPlaying = true;
      }


      count--;
    };

    finishCB();
  };

  return buzzer;

}]);


var PW = angular.module('plankWorkout', [
  'timer',
  'buzzer',
  'workout',
])

.run(function($rootScope, $templateCache) {
  $rootScope.page = {};

  // For Dev, so templates don't get cached while being worked on..
  $rootScope.$on('$viewContentLoaded', function() {
    $templateCache.removeAll();
  });

  $rootScope.page.title = "Plank Workout | Begin";
  $rootScope.page.bodyClass = "initializing";
});


angular.module('timer', [
])

.factory('timer', ['$timeout', function($timeout){

  var timer = {};
  var counter = 0,
      timeout;

  timer.start = function() {
    timeout = $timeout(timer.count, 1000);
  };

  timer.stop = function() {
    if(timeout)
      $timeout.cancel(timeout);
  };

  timer.reset = function() {
    if(timeout)
      $timeout.cancel(timeout);

    counter = 0;
  };

  timer.count = function() {

    if(counter > 0) {
      timeout = $timeout(timer.count, 1000);
      counter--;
    } else {
      // counter is zero, don't set another timeout
      // Just let it end.
    }

  };

  timer.getCount = function() {
    return counter;
  };

  timer.setCounter = function(d) {
    counter = d;
  };

  return timer;

}]);


angular.module('workout', [
  'timer',
  'buzzer',
])
  
.controller('workoutCtrl', ['$scope', '$rootScope', 'timer', 'buzzer', function($scope, $rootScope, timer, buzzer) {

  $scope.showingOptions = $scope.isStarted = $scope.isActive = $scope.workoutCompleted = $scope.showDetails = false;

  $scope.toggleOptions = function(){
    if($scope.showingOptions)
      $scope.showingOptions = false;
    else
      $scope.showingOptions = true;
  };

  $scope.difficultyOptions = [
    'beginner',
    'easy',
    'medium',
    'hard',
    'beast',
  ];

  $scope.settings = {
    difficulty:  'medium',
    audio: true,
//    random:  0, // Add randomization laterss
  };

  $scope.getTimeDuration = function(duration){
    switch ($scope.settings.difficulty) {
      case 'beginner': 
        segmentTime = 10;
        break;
      case 'easy': 
        segmentTime = 15;
        break;
      case 'medium': 
        segmentTime = 30;
        break;
      case 'hard': 
        segmentTime = 45;
        break;
      case 'beast':
        segmentTime = 60;
        break;
      default:
        segmentTime = 30;
    }

    return  segmentTime * duration;
  };


  $scope.exercises = [{
    name: 'Basic Plank',
    duration: 2,
    item: 0,
    img: 'plank-basic.png'
  },{
    name: 'Elbow Plank',
    duration: 1,
    item: 1,
    img: 'plank-elbow.png'
  },{
    name: 'Left Leg Raised Plank',
    duration: 1,
    item: 2,
    img: 'plank-leg-left.png'
  },{
    name: 'Right Leg Raised Plank',
    duration: 1,
    item: 3,
    img: 'plank-leg-right.png'
  },{
    name: 'Left Side Plank',
    duration: 1,
    item: 4,
    img: 'plank-side-left.png'
  },{
    name: 'Right Side Plank',
    duration: 1,
    item: 5,
    img: 'plank-side-right.png'
  },{
    name: 'Basic Plank',
    duration: 1,
    item: 6,
    img: 'plank-basic.png'
  },{
    name: 'Elbow Plank',
    duration: 2,
    item: 7,
    img: 'plank-elbow.png'
  }];

  $scope.currentExercise = $scope.exercises[0];


  $scope.isCurrentExercise = function(exerciseItem) {
    return ($scope.currentExercise.item == exerciseItem);
  };


  // Calculate Total Workout Time, based on difficulty
  $scope.TotalWorkoutTime = function(){

    var exercises = $scope.exercises,
        totalTime = 0;

    exercises.forEach(function(e, i, a){
      totalTime += $scope.getTimeDuration(e.duration);
    });

    var minutes = Math.floor(totalTime / 60);
    var seconds = totalTime - minutes * 60;

    var time = "";
    if(minutes)
      time += minutes + " min";
    
    if(seconds)
      time += " & " + seconds + " sec";
    
    return time;
  };


  $scope.startWorkout = function() {
    $scope.isStarted = true;
    $scope.isActive = true;

    timer.setCounter($scope.getCurrentExerciseDuration());
    timer.start();
  };

  $scope.pauseWorkout = function() {
    $scope.isActive = false;
    timer.stop();
  };

  $scope.resumeWorkout = function() {
    $scope.isActive = true;
    timer.start();
  };

  $scope.getCurrentExerciseDuration = function() {
    return $scope.getTimeDuration($scope.currentExercise.duration);
  };

  $scope.setCurrentExerciseDuration = function(n) {
    currentWorkoutTimer = n;
  };


  $scope.currentWorkoutTimer = $scope.getCurrentExerciseDuration(); 


  $scope.nextExercise = function() {

    if($scope.isLastExercise())
      return false;

    timer.reset();
    $scope.currentExercise = $scope.getNextExercise();
    $scope.currentWorkoutTimer = $scope.getCurrentExerciseDuration(); 

    timer.setCounter($scope.currentWorkoutTimer);
    timer.start();
    
  };

  $scope.prevExercise = function() {

    var prev = $scope.currentExercise.item - 1;
    if(!$scope.isFirstExercise())
      $scope.currentExercise = $scope.exercises[prev];
    
  };

  $scope.getNextExercise = function() {

    if(!$scope.isLastExercise()){

      var next = $scope.currentExercise.item + 1;
      return $scope.exercises[next];
    }

  };



  $scope.$watch ( function() { return timer.getCount(); }, function(count) {

    if(!$scope.isStarted) {
      return;
    }

    if(count === 3 && $scope.settings.audio)
      buzzer.warning();

    if(count > 0) {
      $scope.currentWorkoutTimer = count;
      return;
    }

    if( $scope.isLastExercise() ) {
      if($scope.settings.audio)
        buzzer.finish();
      $scope.endWorkout();
    } else {
      if($scope.settings.audio)
        buzzer.ending();
      $scope.nextExercise();
    }

  }, true);


  $scope.endWorkout = function() {
    $scope.workoutCompleted = true;
    timer.reset();
  };

  $rootScope.page.title = 'Plank Workout | ' + $scope.currentExercise.name;
  $rootScope.page.bodyClass = "workout";

  $scope.isFirstExercise = function(){
    if($scope.currentExercise == $scope.exercises[0])
      return true;
    
    return false;
  };

  $scope.isLastExercise = function(){
    var total = $scope.exercises.length - 1;
    if($scope.currentExercise == $scope.exercises[total])
      return true;

    return false;
  };



  $scope.toggleDetails = function(){
    console.log($scope.showDetails);

    if($scope.showDetails === false) {
      console.log("showdetails");
      $scope.showDetails = true;
    } else {
      console.log("hidedetails");
      $scope.showDetails = false;
    }

  };


}]);

