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



/* ----- Team head-to-head ----- */



/* ----- Player projection ----- */



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
