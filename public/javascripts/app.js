var app = angular.module('angularjsNodejsTutorial', []);

// Controller for the Dashboard page
app.controller('dashboardController', function($scope, $http) {
  // TODO: Q1
});

// Controller for the Player head to head comparison page
app.controller('playerh2hController', function($scope, $http) {
  $scope.submitPlayers = function() {
    $http({
      url: '/playerh2h/' + $scope.player1Name + '/' + $scope.player2Name,
      method: 'GET'
    }).then(res => {
      $scope.playerStats = res.data;
    }, err => {
      console.log("Projection ERROR", err);
    });
  }
});

// Controller for the Team head to head comparison page
app.controller('teamh2hController', function($scope, $http) {
  $scope.submitTeams = function() {
    $http({
      url: '/teamh2h/' + $scope.team1Name + '/' + $scope.team2Name,
      method: 'GET'
    }).then(res => {
      $scope.playerPerformance = res.data.firstQuery;
      $scope.teamRecord = res.data.secondQuery;
    }, err => {
      console.log("Projection ERROR", err);
    });
  }
});

// Controller for the Projections Page
app.controller('projectionController', function($scope, $http) {

  $scope.submitPlayer = function() {
    $http({
      url: '/projection/' + $scope.playerName,
      method: 'GET'
    }).then(res => {
      $scope.similarPlayers = res.data;
    }, err => {
      console.log("Projection ERROR", err);
    });
  }

});

// Controller for the Best Of Page
app.controller('bestofController', function($scope, $http) {
  // TODO: Q3
});
