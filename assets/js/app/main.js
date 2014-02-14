var PW = angular.module('plankWorkout', [
  'timer',
  'workout',
])

.run(function($rootScope, $templateCache, $window, $timeout) {
  $rootScope.page = {};

  // For Dev, so templates don't get cached while being worked on..
  $rootScope.$on('$viewContentLoaded', function() {
    $templateCache.removeAll();

    $timeout(function(){
      $window.scrollTo(0,1);
    }, 0);
  });

  $rootScope.page.title = "Plank Workout | Begin";
  $rootScope.page.bodyClass = "initializing";
});

