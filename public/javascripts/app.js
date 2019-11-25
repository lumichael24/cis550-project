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
app.controller('collegeFactsController', function($scope, $http) {

  $http({
    url: '/retrieveByPosition/',
    method: 'GET'
  }).then(res => {
    $scope.colleges = res.data;
    retrieveByOverall();
  }, err => {
    console.log("retrieveByPosition ERROR", err);
  });

  var retrieveByOverall = function() {
    $http({
      url: '/retrieveByOverall/',
      method: 'GET'
    }).then(res => {
      $scope.overall = res.data;
      getSleepers();
    }, err => {
      console.log("retrieveByOverall ERROR", err);
    });
  }

  var getSleepers = function() {
    $http({
      url: '/getSleepers/',
      method: 'GET'
    }).then(res => {
      $scope.sleepers = res.data;
      getBusts();
    }, err => {
      console.log("Sleepers ERROR", err);
    });
  }

  var getBusts = function() {
    $http({
      url: '/getBusts/',
      method: 'GET'
    }).then(res => {
      $scope.busts = res.data;
    }, err => {
      console.log("Busts ERROR", err);
    });
  }

});
