var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var cors = require('cors');
var app = express();

app.use(bodyParser.json());
app.use(cors());
var sql = require("mssql");

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

app.get("/api/transactionHistory", function(req , res) {
  //getTransactions();
  //return res.send('GET transaction data');
  sql.connect(dbConfig, function (err) {

    if (err) console.log(err);

    var request = new sql.Request();

    request.query("SELECT th.transaction_type, ii.on_hand, ig.min_qty, ic.brand_description, ig.max_qty, ic.package_qty, th.quantity, ic.cin, th.transaction_date\n" +
      "FROM transaction_history th\n" +
      "JOIN inventory_items ii on ii.location_key = th.location_key AND ii.cin = th.cin\n" +
      "JOIN igsp ig on ig.location_key = th.location_key and ig.group_key = ii.group_key\n" +
      "JOIN item_catalog ic on ic.cin = ii.cin and ic.SUPPLIER_ID = th.SUPPLIER_ID and ic.TRADING_PARTNER_ID = ii.TRADING_PARTNER_ID\n" +
      "where transaction_type IN (0, 1, 3)\n" +
      "and th.location_key = 3782\n" +
      "and th.cin = 3695665", function (err, recordset) {

      if (err) console.log(err)

      // send records as a response
      res.send(recordset);

    });
  });
});

/*async function getTransactions() {
  try {
  let conn = await sql.connect(dbConfig);
  console.log("connect successful" + conn);
  let transactions = conn.request().query("select * from transaction");
  return transactions.recordsets;
} catch (error) {
  console.log(error)
}*/

 /*function getTransactions() {
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
}
*/

/*function getTransactions(){
  sql.connect(dbConfig, function (err) {
    if (err) console.log(err);
    var request = new sql.Request();
    request.query('select * from transaction', function (err, recordset,res) {
      if (err) console.log(err)
      res.send(recordset);

    });
  });
}*/


/*try {
  let conn = await sql.connect(dbConfig);
  console.log("connect successful" + conn);
  let transactions = conn.request().query("select * from transaction");
  return transactions.recordsets;
} catch (error) {
  console.log(error)
}*/
module.exports = app;
