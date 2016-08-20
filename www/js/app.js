(function() {

var app = angular.module('myreddit', ['ionic' , 'angularMoment']);

app.controller('RedditCtrl', function($http, $scope) {
  $scope.stories = [];
 

  /** load de historia **/
  function loadStories(params, callback){
      $http.get('https://www.reddit.com/r/funny/new/.json', {params:params})
        .success(function(response){
          var stories = [];
          angular.forEach(response.data.children, function(child){
            var story = child.data;
            if (!story.thumbnail || story.thumbnail === 'self' || story.thumbnail === 'default'){
              story.thumbnail = 'http://www.redditstatic.com/icon.png';
            }
            else if(story.thumbnail === 'nsfw'){
               story.thumbnail = 'http://i.imgur.com/UHzw6.png';
            }
           stories.push(child.data);
          });
          callback(stories);
        });
  }

  /** load de historia antiga no scroll down **/
    $scope.loadOlderStories = function(){
      var params = {};
      if($scope.stories.length > 0){
        params['after'] = $scope.stories[$scope.stories.length - 1].name;
      }
      loadStories(params , function(olderStories){
        $scope.stories = $scope.stories.concat(olderStories);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };


  /** load de historia recent no scroll up **/
    $scope.loadNewerStories = function(){
      var params = {'before': $scope.stories[0].name};
      loadStories(params, function(newerStories){
        $scope.stories = newerStories.concat($scope.stories);
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    $scope.openLiunk = function(url){
      windows.open(url, '_blank');
    };

});



app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

}());
