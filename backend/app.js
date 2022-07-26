var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var cors = require('cors');
var app = express();

app.use(bodyParser.json());
app.use(cors());

// app.use((req, res, next) => {
//   console.log('First middleware');
//   next();
// });

// app.use((req, res, next) => {
//   res.send('Hello from Express');
// });

var dbConfig = {
  /*host: "wdec5009cimdb02.dev.npch.int",
  port: 1433,
  databaseName: "cim2",
  username: "cimweb",
  password: "cimweb1",*/

  user: "cimweb",
  password: "cimweb1",
  server: "wdec5009cimdb02.dev.npch.int" ,
  database: "cim2",
  port: 1433,
  options:{
    trustServerCertificate: true,
    enableArithAort: true,

  }

};
app.get('/', (req, res) => {
  return res.send('Hello Express');
});

app.get('/users', (req, res) => {
  return res.send('GET HTTP method on user resource');
});

app.get("/api/transactionHistory", function(req , res){
  getTransactions();
  //return res.send('GET transaction data');
});

/*async function getTransactions() {
  console.log("get employee");
  var dbConn = new sql.Connection(dbConfig);
  dbConn.connect().then(function () {
    var request = new sql.Request(dbConn);
    request.query("select * from employee").then(function (resp) {
      console.log(resp);
      dbConn.close();
    }).catch(function (err) {
      console.log(err);
      dbConn.close();
    });
  }).catch(function (err) {
    console.log(err);
  });
}*/

function getTransactions() {
  var dbConn = new sql.ConnectionPool(dbConfig);
  dbConn.connect().then(function () {
    var request = new sql.Request(dbConn);
    request.query("select top 1 * from transaction_history").then(function (resp) {
      console.log(resp);
      dbConn.close();
    }).catch(function (err) {
      console.log(err);
      dbConn.close();
    });
  }).catch(function (err) {
    console.log(err);
  });
  //dbConn.close();
/*try {
  let conn = await sql.connect(dbConfig);
  console.log("connect successful" + conn);
  let transactions = conn.request().query("select * from transaction");
  return transactions.recordsets;
} catch (error) {
  console.log(error)
}*/
}

module.exports = app;
