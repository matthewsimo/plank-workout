angular.module('workout', [
  'timer',
])
  
.controller('workoutCtrl', ['$scope', '$rootScope', 'timer', function($scope, $rootScope, timer) {

  $scope.isStarted = $scope.isActive = $scope.workoutCompleted = $scope.showDetails = false;

  $scope.difficultyOptions = [
    'beginner',
    'easy',
    'medium',
    'hard',
    'beast',
  ];

  $scope.settings = {
    difficulty:  'easy',
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

    if(count > 0) {
      $scope.currentWorkoutTimer = count;
      return;
    }

    if( $scope.isLastExercise() ) {
      $scope.endWorkout();
    } else {
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

