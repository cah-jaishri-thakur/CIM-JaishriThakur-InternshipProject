const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var sql = require("mssql");
var dbConfig = {
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


// defining the Express app
const app = express();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

app.get("/api/transactionHistory", function(req , res){
  getTransactions().then(resp => {
      res.send(resp.recordsets[0]);
  });
});

function getTransactions() {
  var dbConn = new sql.ConnectionPool(dbConfig);
  return dbConn.connect().then(function () {
    var request = new sql.Request(dbConn);
    return request.query("select top 1 * from transaction_history").then(function (resp) {
      return resp;
      dbConn.close();
    }).catch(function (err) {
      console.log(err);
      dbConn.close();
    });
  }).catch(function (err) {
    console.log(err);
  });
}


// starting the server
app.listen(3000, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


module.exports = app;
