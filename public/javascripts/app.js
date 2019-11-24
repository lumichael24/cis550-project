var app = angular.module('angularjsNodejsTutorial', []);

// Controller for the Dashboard page
app.controller('dashboardController', function($scope, $http) {
  // TODO: Q1
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
  $scope.submitByPosition = function() {
    $scope.show = false;
    $http({
      url: '/retrieveByPosition/',
      method: 'GET'
    }).then(res => {
      $scope.show = true;
      $scope.colleges = res.data;
    }, err => {
      console.log("retrieveByPosition ERROR", err);
    });
  }
  $scope.submitByOverall = function() {
    $scope.showOverall = false;
    $http({
      url: '/retrieveByOverall/',
      method: 'GET'
    }).then(res => {
      $scope.showOverall = true;
      $scope.overall = res.data;
    }, err => {
      console.log("retrieveByOverall ERROR", err);
    });
  }
  $scope.submitBySleepers = function() {
    $http({
      url: '/getSleepers/',
      method: 'GET'
    }).then(res => {
      $scope.sleepers = res.data;
    }, err => {
      console.log("Sleepers ERROR", err);
    });
  }
  $scope.submitByBusts = function() {
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
