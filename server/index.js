//Quiz Server Lobby
//Ross Mitchell and Melvin Abraham

// const { Console } = require('console');
// const path = require('path');
// var app = require('express')();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

const port = process.env.PORT || 4000;

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
var mongo = require('mongodb');
var assert = require('assert');

var url='mongodb://team6-mongodb:4LITWMsMLAzi1w4rZbuOo0wgaaUlFk0nO3WMj1riXjsnL0rkZqmRgeX0oVnWTHOhlOgr7NX6H97S00pwfgWxlA==@team6-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@team6-mongodb@'


const app = express();
const server =http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'index./html')));



var Lobbies={};

var question=[];
var idquestionsAlreadyAsked=[]


//Function to create random id of N length (makeid) was not created by the team
// was created by user csharptest.net on stackoverflow
// https://stackoverflow.com/a/1349426
function makeid(length=6) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



function CreateLobby(name,id,col,ani){
  let user={
    id,
    PlayerName: name,
    score:0,
    Colour:col,
    Animal:ani
  }

  let LobbyCode= makeid();
  while (Lobbies.hasOwnProperty(LobbyCode)) {
    LobbyCode = makeid();
  }

  user.lobby= LobbyCode;

  Lobbies[LobbyCode]={
    lobbycode: LobbyCode,
    players:[user],
    question:[],
    idquestionsAlreadyAsked:[]
  }

  return LobbyCode
}


function JoinLobby(name,code,id,col,ani){
  let user={
    id,
    PlayerName: name,
    score:0,
    Colour:col,
    Animal:ani
  }

  if(!(Lobbies.hasOwnProperty(code))){
    return false
  }

  user.lobby=code;
  Lobbies[code].players.push(user);

  return true

}



function removeUser(id){
  //find user in lobbies
  for(key in Lobbies){
    for (let index = 0; index < Lobbies[key].players.length; index++) {
      if(Lobbies[key].players[index].id == id){
        Lobbies[key].players.splice(index,1);
      }
    }
  }
}


function updateScore(id,code,scoreToAdd){
  const index= Lobbies[code].players.findIndex(user => user.id===id)

    if(index !== -1){
        Lobbies[code].players[index].score += scoreToAdd;
        console.log(`Score: ${Lobbies[code].players[index].score}`)
      }
}

async function loadQuestionPre(numberOfRounds){
  mongo.connect(url, function(err, db){
    if(err){
      console.log("We have an error1");
    }
    console.log("got MDBhere");
    var dbo= db.db("questions");
    var client=dbo.collection("questions");


    //Get id's without repeating
    var idtoGet=[];

    //Generate random number
    var max= 500;
    
  

    while (numberOfRounds>0) {
       // 1 -> 500
        var id= Math.floor(Math.random() * max) + 1;
        //Check if id is in id array and if already asked
          if(idtoGet.indexOf(id) && idquestionsAlreadyAsked.indexOf(id) === -1){
            idtoGet.push(id);
            numberOfRounds-=1;
          }else{
          //go again 
            console.log(`id already used`);
          }
    }
    



    console.log(`idsTofind ${idtoGet}`)

    for (let index = 0; index < idtoGet.length; index++) {
      dbo.collection("questions").findOne({"id":idtoGet[index]}, async function(err, result){
        if(err){
          console.log(`we have an error 2`);
        }
  
        await question.push(result);
      });
    }
    

  })
}


async function loadQuestion(numberOfRounds, code){
  mongo.connect(url, function(err, db){
    if(err){
      console.log("We have an error1");
    }
    console.log("got MDBhere");
    var dbo= db.db("questions");
    var client=dbo.collection("questions");


    //Get id's without repeating
    var idtoGet=[];

    //Generate random number
    var max= 500;
    
  

    while (numberOfRounds>0) {
       // 1 -> 500
        var id= Math.floor(Math.random() * max) + 1;
        //Check if id is in id array and if already asked
          if(idtoGet.indexOf(id) && Lobbies[code].idquestionsAlreadyAsked.indexOf(id) === -1){
            idtoGet.push(id);
            numberOfRounds-=1;
          }else{
          //go again 
            console.log(`id already used`);
          }
    }
    



    console.log(`idsTofind ${idtoGet}`)

    for (let index = 0; index < idtoGet.length; index++) {
      dbo.collection("questions").findOne({"id":idtoGet[index]}, async function(err, result){
        if(err){
          console.log(`we have an error 2`);
        }
  
        await Lobbies[code].question.push(result);
      });
    }
    

  })
}




function getQuestion(code){
  if(Lobbies[code].question.length<2){
    loadQuestion(9,code);
  }

  Lobbies[code].idquestionsAlreadyAsked.push(Lobbies[code].question[0].id);
  return Lobbies[code].question[0]
}




function getLeaderboard(code){
  
  Lobbies[code].players=Lobbies[code].players.sort(function(a, b){return a.score - b.score});
  var leaderboard={}

  //Get the scores
  for (let index = 0; index <  Lobbies[code].players.length; index++) {
    leaderboard[index]={
      name:Lobbies[code].players[index].PlayerName,
      score:Lobbies[code].players[index].score,
      colour:Lobbies[code].players[index].colour,
      animal:Lobbies[code].players[index].animal
    }
  }

  return leaderboard;

}



io.on('connection', (socket) => {
  console.log('a user connected');
  //CreateLobby();
  loadQuestionPre(10);

  socket.on('new_visitor',user=>{
    console.log("new visitor", user);
    socket.user= user;
  })

  //NAME:name:HOST
  //HOST- name, colour, animal
  socket.on("HOST", (name,colour,animal)=>{
    console.log("Create Lobby");

    var lobbyCode=CreateLobby(name,socket.id,colour,animal);
    //loadQuestion(10,lobbyCode);
    Lobbies[lobbyCode].question=question;
    Lobbies[lobbyCode].idquestionsAlreadyAsked=idquestionsAlreadyAsked;
    socket.join(lobbyCode);
    
    
    //Emit the code back
    io.emit("CODE",lobbyCode);
  })


 
  //NAME:name:JOIN:code:RED:DOG
  //JOIN:name,code, colour, animal
  socket.on("JOIN", ({name,code,colour,animal})=>{
    console.log(`Joining Lobby ${code}`);
    //Join the lobby
    var worked=JoinLobby(name,code,socket.id,colour,animal);
    
    if(worked){
      //JoinRoom
      socket.join(code);
    }else{
      //Emit error
      io.emit("FAIL","Incorrect Lobby Code")
    }
  });

  //NAME:name:CODE:code:SCORE:score
  //SCORE- score,code
  socket.on("SCORE", ({score,code})=>{
    console.log("Updating score");
    updateScore(socket.id,code,score);
  });

  //NAME:name:CODE:code:QUESTION
  //QUESTION- code
  socket.on("QUESTION", ({code})=>{
    //Get the question
    console.log("get question");
    console.log(`QuestionsArray: ${Lobbies[code].question}`)
      var questionToSend= getQuestion(code);
      io.emit("QUESTION",questionToSend)
      question.splice(0,1);



    //Emit back question
      //io.emit("QUESTION",question);
  });

  socket.on("LEADERBOARD", ({code})=>{
    console.log("Get leaderboard");
    console.log(`code: ${code}`)
    var leaderboard= getLeaderboard(code);

    //Emit the leaderboard
    io.emit("LEADERBOARD",leaderboard);

  })


  //User has closed the website
  socket.on('disconnect', function(){
    console.log('a user has disconnected')
    //Remove user from rooms
    removeUser(socket.id);
  })
});



// http.listen(port, () => {
//   console.log(`listening on *:${port}`);
// });


server.listen(port, () => console.log(`Server running on port ${port}`));
