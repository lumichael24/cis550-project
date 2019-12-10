var app = angular.module('angularjsNodejsTutorial', []);

// Controller for the Dashboard page
app.controller('dashboardController', function($scope, $http) {
});

// Controller for the Player head to head comparison page
app.controller('playerh2hController', function($scope, $http) {
  $scope.submitPlayers = function() {

    if ($scope.player1Name === undefined || $scope.player2Name === undefined || $scope.player1Name === '' || $scope.player2Name === '') {
      return;
    }

    $http({
      url: '/playerh2h/' + $scope.player1Name + '/' + $scope.player2Name,
      method: 'GET'
    }).then(res => {

      // Collate info into wins, ppg, apg, rpg
      var map = {}
      for (i = 0; i < res.data.length; i++) {
        var obj = res.data[i];

        var playerKey = obj['Player_Name'].toLowerCase();

        if (playerKey in map) {
          map[playerKey]['ast'][obj["Outcome"]] += obj['ast']
          map[playerKey]['pts'][obj["Outcome"]] += obj['pts']
          map[playerKey]['trb'][obj["Outcome"]] += obj['trb']
        } else {
          map[playerKey] = {}

          var nameList = playerKey.split(" ");
          var firstName = nameList[0];
          var lastName = nameList[1];

          var imageLink = 'https://nba-players.herokuapp.com/players/' + lastName +'/' + firstName;

          map[playerKey]['imageLink'] = imageLink;
          map[playerKey]['name'] = obj['Player_Name']
          map[playerKey]['results'] = {'W': 0, 'L': 0}
          map[playerKey]['ast'] = {'W': 0, 'L': 0}
          map[playerKey]['pts'] = {'W': 0, 'L': 0}
          map[playerKey]['trb'] = {'W': 0, 'L': 0}
          map[playerKey]['ast'][obj["Outcome"]] = obj['ast']
          map[playerKey]['pts'][obj["Outcome"]] = obj['pts']
          map[playerKey]['trb'][obj["Outcome"]] = obj['trb']
        }
        if (obj["Outcome"] === "W") {
          map[playerKey]['results']['W'] = obj["Num"]
        } else {
          map[playerKey]['results']['L'] = obj["Num"]
        }
      }

      var returnMap = {};
      // Get ordering right
      returnMap['player1'] = map[$scope.player1Name.toLowerCase()]
      returnMap['player2'] = map[$scope.player2Name.toLowerCase()]

      if (res.data.length > 0) {
        $scope.playerStats = returnMap
      } else {
        $scope.playerStats = "no players";
      }


      console.log($scope.playerStats);
    }, err => {
      console.log("Projection ERROR", err);
    });
  }
});

// Controller for the Team head to head comparison page
app.controller('teamh2hController', function($scope, $http) {
  $scope.submitTeams = function() {

    if ($scope.team1Name === $scope.team2Name) {
      return;
    }

    $http({
      url: '/teamh2h/' + $scope.team1Name + '/' + $scope.team2Name,
      method: 'GET'
    }).then(res => {
      $scope.playerPerformance = res.data.firstQuery;

      team1Players = []
      team2Players = []
      console.log(res.data.firstQuery);
      for (i = 0; i < res.data.firstQuery.length; i++) {
        var curr = res.data.firstQuery[i];
        if (curr.TeamName === $scope.team1Name) {
          team1Players.push(curr);
        } else if (curr.TeamName === $scope.team2Name) {
          team2Players.push(curr);
        }
      }

      console.log(team1Players);
      console.log(team2Players);

      $scope.team1Players = team1Players;
      $scope.team2Players = team2Players;

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

  $scope.teams = ['Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets', 'Chicago Bulls'
                  ,'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets', 'Detroit Pistons'
                  ,'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers', 'LA Clippers'
                  ,'LA Lakers', 'Miami Heat', 'Milwaukee Bucks', 'Minnesota Timberwolves'
                  , 'New Orleans Pelicans'
                  ,'New York Knicks', 'Orlando Magic', 'Philadelphia 76ers'
                  ,'Phoenix Suns', 'Portland Trail Blazers', 'Sacramento Kings', 'San Antonio Spurs'
                  ,'Oklahoma City Thunder', 'Utah Jazz', 'Washington Wizards', 'Toronto Raptors'
                  ,'Memphis Grizzlies','Charlotte Hornets'].sort();

  $scope.image1 = '../assets/team-logos/' + $scope.team1Name + '.gif'
  $scope.image2 = '../assets/team-logos/' + $scope.team2Name + '.gif'
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


app.controller('newsController', function($scope, $http) {
  try {
    $http({
      url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.espn.com%2Fespn%2Frss%2Fnba%2Fnews',
      method: 'GET',
    }).then(res => {
      $scope.articles = res.data.items;
      console.log($scope.articles);
    })
  } catch (error) {
    console.log(error);
  }
});
