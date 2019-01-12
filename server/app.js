// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();

const ipfsAPI = require('ipfs-api');
const fs = require('fs');




// url to mongodb 
// db name is defined in the URL
mongoose.connect("mongodb://Speisekartoffel:aBAT6P0iCQj22T1x@cluster0-shard-00-00-dmulp.mongodb.net:27017,cluster0-shard-00-01-dmulp.mongodb.net:27017,cluster0-shard-00-02-dmulp.mongodb.net:27017/redlist?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin");


// create Schema 
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    _id:  Schema.Types.ObjectId,
    date: String,
    lat_bin:   String,
    lon_bin: String,
    mmsi: String,
    fishing_hours: String
  },
  { collection : 'vessels1' });


blogSchema.plugin(mongoosePaginate);
var Vessels = mongoose.model('Vessels', blogSchema);

// connect to Mongodb
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected')
});

// Get Tags
// Send result to localhost:9000/tag/
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions))



// create Route with pagination
app.get('/gh/', (req, res) => {
  var perPage = 1000
  , page = Math.max(0, req.param('page'))

	Vessels.find( (err, vessels) => {
		if (err) return console.error(err);
		// console.log(vessels);
		// console.log(Vessels.db.name);
		res.json(vessels);
	}).limit(perPage)
    .skip(perPage * page)
    .exec(function(err, vessels) {
        Vessels.countDocuments().exec(function(err, count) {
          if (err) return console.error(err);
        })
    });
});



app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));



// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;