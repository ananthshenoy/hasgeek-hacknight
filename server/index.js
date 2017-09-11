const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const uri = 'mongodb://localhost/find-buddy';
const PORT = 8081;

const db = mongoose.connect(uri, function(err) {
    if (err) throw err;
});

const rating = new mongoose.Schema({
  user: String,
	actions: Object
});

const Rating = mongoose.model('Preference', rating);


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/buddy/", function(req, res) {
  let userName = req.body.user;
  let action = req.body.action;
  let friendName = req.body.friend;
  let resArr = [];
  Rating.update(
  { user: userName },
  {
    $push: {
      actions: {
         name: friendName,
         value: action
      }
    }
  },
  {upsert:true}, function(err, numberAffected, rawResponse) {
    getMatch(userName, action, function(response) {
      console.log("indddddd",response);
      res.send(response);
    });
  });
});

app.get('/buddy/:action', function (req, res) {
  res.set('Content-Type', 'application/json');
  let name = req.params.action;
  Rating.findOne({user:name}, function(err,user) {
    res.send(user);
  });
});


app.delete('/buddy/:action', function (req, res) {
  res.set('Content-Type', 'application/json');
  Rating.remove({ }, function(err,user) {
    console.log("deleted");
  });
  res.send('{"message":"Hello from the custom server!"}');
});

function getMatch(userName, action, callback) {
  let res = [];
  console.log("in getmatch",userName, action);
  Rating.find({"actions.name":{ $eq:userName }}, function(err, users) {
    if(users) {
      console.log("users",users.length);
      for(let i=0;i<users.length;i++) {
      for(let j=0;j<users[i].actions.length;j++) {
        console.log(users[i].actions[j].name, userName, users[i].actions[j].value, action);
        if(users[i].actions[j].name === userName && users[i].actions[j].value === action) {
          res.push({name:users[i].user, value:users[i].actions[j].value});
        }
      }
    }
    callback(res);
    }
  });
}

function getMatchInit(userName, callback) {
  let res = [];
  let user = '';
  Rating.findOne({"user":{ $eq:userName }}, function(err, user) {
    if(user != null) {
      callback(user);
    }
  });
 
}

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../ui/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
