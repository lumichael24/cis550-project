var express = require('express');
var router = express.Router();
var path = require('path');
var config = require('../db-config.js');

/* ----- Connects to your mySQL database ----- */

var mysql = require('mysql');
//var oracledb = require('oracledb')

config.connectionLimit = 10;
var connection = mysql.createPool(config);
/*var connection = oracledb.getConnection({
  connectString     : process.env.RDS_HOSTNAME,//'cis550.cjh0ekn9ikxr.us-east-1.rds.amazonaws.com:1521/BBALLDB',
  //connectionLimit: 10,
  user     : 'lu20',
  password : 'password',
  database : 'cis550',
  port     : '1521'
});*/


/*
connection.query('SELECT * FROM NBA WHERE ROWNUM <= 1', function (err, result, fields) {
    if (err) throw new Error(err)
})*/

/* ------------------------------------------- */
/* ----- Routers to handle FILE requests ----- */
/* ------------------------------------------- */

router.get('/', function(req, res) {
  //console.log(connection)
  res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html'));
});

/* ----- Player head to head ----- */
router.get('/playerh2h', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'playerh2h.html'));
});

/* ----- Team head to head ----- */
router.get('/teamh2h', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'teamh2h.html'));
});

/* ----- Player projection ----- */
router.get('/projection', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'projection.html'));
});

/* ----- College facts ----- */
router.get('/college', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'college.html'));
});


/* Template for a FILE request router:

Specifies that when the app recieves a GET request at <PATH>,
it should respond by sending file <MY_FILE>

router.get('<PATH>', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', '<MY_FILE>'));
});

*/


/* ------------------------------------------------ */
/* ----- Routers to handle data requests ----- */
/* ------------------------------------------------ */

/* ----- Player head-to-head ----- */

router.get('/playerh2h/:player1name/:player2name', function(req, res) {
  // Parses the customParameter from the path, and assigns it to variable myData
  var player1Name = req.params.player1name;
  var player2Name = req.params.player2name;
  var query = `
  WITH P1_ID AS (
    SELECT PM.player_id
    FROM Player_Map PM
    WHERE PM.name = "`+ player1Name +`"
  ), P2_ID AS (
    SELECT PM.player_id
    FROM Player_Map PM
    WHERE PM.name = "`+ player2Name +`"
  ), P1_GAMES AS (
    SELECT Game_id, person_id, Player_Name, Abbreviation, Outcome, Points, Rebounds, Assists
    FROM Player_Boxscores PBS
    WHERE person_id in (SELECT player_id FROM P1_ID)
  ), P2_GAMES AS (
    SELECT Game_id, person_id, Player_Name, Abbreviation, Outcome, Points, Rebounds, Assists
    FROM Player_Boxscores PBS
    WHERE person_id in (SELECT player_id FROM P2_ID)
  ), GAMES_INTERSECTION_P1 AS (
    SELECT P1G.person_id, P1G.Player_Name, P1G.Outcome, P1G.Points, P1G.Rebounds, P1G.Assists
    FROM P1_GAMES P1G JOIN P2_GAMES P2G ON P1G.Game_id = P2G.Game_id
    WHERE P1G.Abbreviation <> P2G.Abbreviation
  ), GAMES_INTERSECTION_P2 AS (
    SELECT P2G.person_id, P2G.Player_Name, P2G.Outcome, P2G.Points, P2G.Rebounds, P2G.Assists
    FROM P1_GAMES P1G JOIN P2_GAMES P2G ON P1G.Game_id = P2G.Game_id
    WHERE P1G.Abbreviation <> P2G.Abbreviation
  ), SUMMARY AS (
    (SELECT GIP1.Player_Name, AVG(GIP1.Points) AS pts, AVG(GIP1.Rebounds) AS trb, AVG(GIP1.Assists) AS ast, GIP1.Outcome, COUNT(*) as Num
    FROM GAMES_INTERSECTION_P1 GIP1
    GROUP BY GIP1.Outcome)
    UNION
    (SELECT GIP2.Player_Name, AVG(GIP2.Points) AS pts, AVG(GIP2.Rebounds) AS trb, AVG(GIP2.Assists) AS ast, GIP2.Outcome, COUNT(*) as Num
    FROM GAMES_INTERSECTION_P2 GIP2
    GROUP BY GIP2.Outcome)
  )
  SELECT *
  FROM SUMMARY S
  ORDER BY S.Player_Name, S.Outcome DESC
  `;
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      // Returns the result of the query (rows) in JSON as the response
      res.json(rows);
    }
  });
});



/* ----- Team head-to-head ----- */



/* ----- Player projection ----- */

router.get('/projection/:playername', function(req, res) {
  // Parses the customParameter from the path, and assigns it to variable myData
  var playerName = req.params.playername;
  var query = `
    WITH PS AS (
      SELECT C.name, C.college, C.PTS, C.TRB, C.AST
      FROM College C
      WHERE C.name="`+ playerName +`"
  ), TEMP_LMS AS (
      SELECT DISTINCT(C.name) as playerName, C.college as collegeName, SQRT(POWER(N.PTS - C.PTS, 2) + POWER(N.AST - C.AST, 2) +   POWER(N.TRB - C.TRB, 2)) as similarityValue
      FROM PS N, College C
      WHERE N.PTS IS NOT NULL AND C.PTS IS NOT NULL AND N.AST IS NOT NULL AND C.AST IS NOT NULL AND
      N.TRB IS NOT NULL AND C.TRB IS NOT NULL
  )
  SELECT DISTINCT T.playerName AS name, N.PTS, N.TRB, N.AST
  FROM TEMP_LMS T JOIN NBA N ON T.playerName = N.name AND T.collegeName = N.college
  WHERE T.playerName <> "`+ playerName +`"
  ORDER BY T.similarityValue ASC
  LIMIT 10
  `;
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      // Returns the result of the query (rows) in JSON as the response
      res.json(rows);
    }
  });
});




/* ----- College facts page ----- */



/* General Template for GET requests:

router.get('/routeName/:customParameter', function(req, res) {
  // Parses the customParameter from the path, and assigns it to variable myData
  var myData = req.params.customParameter;
  var query = '';
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      // Returns the result of the query (rows) in JSON as the response
      res.json(rows);
    }
  });
});
*/


module.exports = router;
