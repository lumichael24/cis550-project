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

      // Collate info into wins, ppg, apg, rpg
      var map = {}
      for (i = 0; i < res.data.length; i++) {
        var obj = res.data[i];
        if (obj['Player_Name'] in map) {
          map[obj['Player_Name']]['ast'][obj["Outcome"]] += obj['ast']
          map[obj['Player_Name']]['pts'][obj["Outcome"]] += obj['pts']
          map[obj['Player_Name']]['trb'][obj["Outcome"]] += obj['trb']
        } else {
          map[obj['Player_Name']] = {}
          map[obj['Player_Name']]['ast'] = {'W': 0, 'L': 0}
          map[obj['Player_Name']]['pts'] = {'W': 0, 'L': 0}
          map[obj['Player_Name']]['trb'] = {'W': 0, 'L': 0}
          map[obj['Player_Name']]['ast'][obj["Outcome"]] = obj['ast']
          map[obj['Player_Name']]['pts'][obj["Outcome"]] = obj['pts']
          map[obj['Player_Name']]['trb'][obj["Outcome"]] = obj['trb']
        }
        if (obj["Outcome"] === "W") {
          map[obj['Player_Name']]['W'] = obj["Num"]
        } else {
          map[obj['Player_Name']]['L'] = obj["Num"]
        }
      }

      for (var key in map) {
        var value = map[key];
        // weighted avg
        value['ast'] = ((value['ast']['W']*value['W']) + (value['ast']['L']*value['L'])) / (value['W'] + value['L'])
        value['pts'] = ((value['pts']['W']*value['W']) + (value['pts']['L']*value['L'])) / (value['W'] + value['L'])
        value['trb'] = ((value['trb']['W']*value['W']) + (value['trb']['L']*value['L'])) / (value['W'] + value['L'])

        value['ast'] = value['ast'].toFixed(1);
        value['pts'] = value['pts'].toFixed(1);
        value['trb'] = value['trb'].toFixed(1);

        map[key] = value
      }

      // Get ordering right
      map['player1'] = map[$scope.player1Name]
      map['player2'] = map[$scope.player2Name];
      delete map[$scope.player1Name];
      delete map[$scope.player2Name];


      $scope.playerStats = map
      console.log($scope.playerStats);
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
      console.log(res.data.secondQuery);
      // Convert secondQuery (team record) into Wins and losses
      map = {}
      for (i = 0; i < res.data.secondQuery.length; i++) {
        obj = res.data.secondQuery[i];
        if (obj['Name'] in map) {
          map[obj['Name']][obj['Outcome']] = obj['num'];
        } else {
          map[obj['Name']] = {};
          map[obj['Name']]['Name'] = obj['Name']
          map[obj['Name']][obj['Outcome']] = obj['num'];
          map[obj['Name']]['Conference'] = obj['Conference'];
        }
      }

      console.log(map);
      // Get ordering right
      map['team1'] = map[$scope.team1Name]
      map['team2'] = map[$scope.team2Name];
      delete map[$scope.team1Name];
      delete map[$scope.team2Name];

      console.log(map);
      $scope.teamRecord = map;
    }, err => {
      console.log("Projection ERROR", err);
    });
  }

  $scope.teams = ['Atlanta Hawks', 'Boston Celtics', 'New Orleans Pelicans', 'Chicago Bulls',
                  'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets', 'Detroit Pistons'
                  ,'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers', 'LA Clippers',
                  'LA Lakers', 'Miami Heat', 'Milwaukee Bucks', 'Minnesota Timberwolves',
                  'Brooklyn Nets', 'New York Knicks', 'Orlando Magic', 'Philadelphia 76ers'
                  ,'Phoenix Suns', 'Portland Trail Blazers', 'Sacramento Kings', 'San Antonio Spurs',
                  'Oklahoma City Thunder', 'Utah Jazz', 'Washington Wizards', 'Toronto Raptors',
                  'Memphis Grizzlies','Charlotte Hornets']
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
