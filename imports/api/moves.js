import { Meteor } from 'meteor/meteor';
import settings from '../../settings.json';

var Chess = require('chess').Chess;

Games = new Mongo.Collection('games');
Users = Meteor.users;

export const  movesInit = () => {
  Games.remove({});
  Users.remove({});

}

Meteor.onConnection((connection) => {
    console.log("connection recieved");
});

Meteor.methods({
    readyToPlay: function(){
      var length = Users.find().fetch().length;
      var _id = Users.insert({number: length + 1});
      checkUserAvailability();
      return _id;
    },
    'movePiece': function(move, userId){
        var one = move.substring(0,2);
        var two = move.substring(2);
        console.log(move);
        var m = {from: one, to: two};
        chessObj = Games.find({$or: [{player1: userId}, {player2: userId}]}).fetch().chessObj;
        chessObj.move(m);
        var x = chessObj.moves({verbose: true});
        var y = [];
        for (var i = 0; i < x.length; i++){
          z = x[i].color + "" + x[i].from + "" + x[i].to;
          y.push(z);
        }
        if (chessObj.game_over()){
          Games.remove({$or: [{player1: userId}, {player2: userId}]});
        } else {
          Games.update(
            {$or: [{player1: userId}, {player2: userId}]},
            {$set: {
                    ascii: chessObj.ascii(),
                    latestMove: move,
                    validMoves: y,
                    status: chessObj.game_over()
                  },
            },
            $inc: {turn: 1}
          );
        }
    },
});

function checkUserAvailability(){
  if (Users.find().fetch().length %2 == 0){
    createGame();
  }
}

function createGame(){
  var length = Users.find().fetch();
  var chessObj = new Chess();
  var x = chessObj.moves({verbose: true});
  var y = [];
  for (var i = 0; i < x.length; i++){
    z = x[i].color + "" + x[i].from + "" + x[i].to;
    y.push(z);
  }
  Games.insert(
    {
      chessObject: chessObj,
      ascii: chessObj.ascii(),
      latestMove: null,
      player1: Users.find().fetch()[length -2],
      player2: Users.find().fetch()[length-1],
      turn: 0,
      validMoves: y,
      status: chessObj.game_over(),
    });
}


  if (Meteor.isServer){
      console.log("is server");
      Meteor.publish('game', function gamePublication(userId) {
  	    return Games.find({$or: [{player1: userId}, {player2: userId}]});
  	});
}
