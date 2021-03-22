//connecting to mysql
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234567890"
});

con.connect(function (err) {
  if (!err)
    console.log("Connected to database");
  else
    console.log("error ocured" + JSON.stringify(err));
});

con.query("use testing ;")


module.exports = {

  temp: () => {
    console.log('all done here');
  },

  getall : (callback) => {

    con.query ("SELECT * FROM book ;", function (err, result, fields) {
      if (err) throw err;
     let res = JSON.stringify(result);
      console.log(res);
      return callback(res);
    })
    
  },

  getname : (callback) => {

    let res = [];

    con.query ("select * from book ;", function(err, result, fields){
      if (err) throw err;
      res = JSON.stringify(result);
      return callback(res);
    })
  },

  getspl : (id, callback) => {

    con.query (`select name from book where ISBN = ${id}`, function(err, result, fields){
      if (err) throw err;
      let res = JSON.stringify(result);
      return callback(res);
    })
  },

  postbook : (newbook, callback) => {

    let sql = `INSERT INTO book (ISBN, name, auther) VALUES ("${newbook.isbn}", "${newbook.name}", "${newbook.auther}");`;
    // console.log(sql);
    con.query (sql, function(err, result){
      if (err) throw err;
      return callback(result);
    })

  },

  updatebook : (newbook, callback) => {

    let sql = `update book set name = "${newbook.name}", auther = "${newbook.auther}" where ISBN = ${newbook.isbn};`;

    con.query (sql, function(err, result){
      if (err) throw err;
      return callback(result);
    })

  },

  deletebook : (to_del, callback) => {

    let sql = `delete from book where ISBN = "${to_del}";`;

    con.query (sql, function(err, result){
      if (err) throw err;
      return callback (result);
    })
  }

};
