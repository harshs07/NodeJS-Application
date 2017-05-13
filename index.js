const express = require('express')
const MongoClient = require('mongodb').MongoClient
const Parser= require('body-parser')
const app = express()
const multer = require('multer')


var options = multer.diskStorage({ destination : 'uploads/' ,
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      }
    });
var upload = multer({ storage: options })
var fs = require('fs')
app.set('view engine', 'ejs')
app.use(express.static(__dirname));

var port = process.env.PORT || 8080;
var db;

MongoClient.connect('mongodb://harsh:harsh@ds019846.mlab.com:19846/revnet', (err, database) => {
  if (err) return console.log(err)
  db = database
	app.use(Parser.urlencoded({extended: true}))
	app.get('/', (req, res) => {
  	res.sendFile(__dirname + '/index.html')
  
	})

	app.get('/ListAll', (req, res) => {
  	db.collection('users').find().toArray(function(err, results) {
  	// send HTML file populated with quotes here
  	//console.log("Binary data: "+results[0].avatar)
  	console.log(results[0])
  	 res.render('ListAll.ejs', {users: results})
		})
	})


	app.get('/addUser', (req, res) => {
  	 res.render('addUser.ejs')
	})

	app.get('/searchUser', (req, res) => {
  	 res.render('searchUser.ejs')
	})

	app.get('/deleteUser', (req, res) => {
  	 res.render('deleteUser.ejs')
	})

	app.post('/addUser', upload.single('Image'), (req, res) => {
		var file = upload.single('Image');
		console.log(req.file.path+" ---- "+req.file.filename);
		//console.log("iMAGE:  "+req.file);
		//console.log("IMAGE PATH: "+req.file.path);
		// var newImg = fs.readFileSync(req.file.path);
  //        var encImg = newImg.toString('base64');
  //        var newItem = {
  //               description: req.body.description, 
  //               date: Date(), 
  //               contentType: req.file.mimetype,
  //               size: req.file.size,
  //               img: new Buffer(encImg, 'binary').toString('base64')
  //           };
            //console.log("Image encoded: "+newItem.img);
	 db.collection('users').save({body:req.body,avatar: req.file.filename}, (err, result) => {
	    if (err) return console.log(err)

	    console.log('Database updated: '+ result)
	    res.redirect('/')
	  })
	})

	app.post('/searchUser', (req, res) => {
	console.log(req.body.name);
	 user=db.collection('users').find({"body.name":req.body.name}).toArray(function(err, results) {
	 console.log("Results: "+results)
	 res.render('ListAll.ejs', {users: results})
	})	})


	app.delete('/deleteUser', (req, res) => {
		console.log("User going to be deleted: "+req.body.name);
	 db.collection('users').findOneAndDelete({"body.name": req.body.name},
	  (err, result) => {
	    if (err) return res.send(500, err)
	  res.send("deleted"+req.body.name);
	  })


	})	

  app.listen(port, function() {
	console.log('Application running on http://localhost:' + port);
});
})