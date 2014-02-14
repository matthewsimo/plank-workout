var PW = angular.module('plankWorkout', [
  'timer',
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

