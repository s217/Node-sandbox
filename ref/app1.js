const express = require("express");
//includong express framework

const bodyParser = require("body-parser");
//including body parser

const index = require("./index");
const books = require("./book");

const app = express();
app.use(bodyParser.json());

//creating an object of express

app.get("/", function(req, res){
	res.send("welcome to my server");
})

app.listen(3000, function (req, res) {
	console.log("server is running");
})

index.temp();

app.get("/books", function (req, res){
	index.getall (function(rows){
		console.log(rows)
		res.send(rows);
	} );
})

app.get("/books/name/all", function (req, res){

	index.getname (function(rows){
		res.send(rows);
	});
})

app.get("/books/name", function(req, res){
	
	let id = req.query['id'];

	if (!id) {
		return res.status(400).send('id is required and should be string!')
	}


	index.getspl (id, function(rows){
		res.send(rows);
	});
})

app.post("/book/name/post", function(req, res){

	let book = {
		isbn: req.body.id,
		name: req.body.name,
		auther: req.body.auther
	};

	index.postbook (book, function(rows){
		res.send(rows);
	});
})

app.put("/book/name/update", function(req, res){

	let update_data = {
		isbn: req.body.id,
		name: req.body.name,
		auther: req.body.auther,
	};

	index.updatebook (update_data, function(rows){
		res.send(rows);
	})
})

app.delete("/book/delete", function(req, res){

	let todel = req.query.id;
	
	index.deletebook(todel, function(rows){
		res.send(rows);
	})
})