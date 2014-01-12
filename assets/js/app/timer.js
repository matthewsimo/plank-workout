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

