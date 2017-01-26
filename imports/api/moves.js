import { Meteor } from 'meteor/meteor';

var Chess = require('chess').Chess;
var chess = new Chess();

Ascii = new Mongo.Collection('ascii');
Status = new Mongo.Collection('status');
ValidMoves = new Mongo.Collection('moves');
Ascii.remove({});
Status.remove({});
ValidMoves.remove({});

Ascii.insert({element: 'main', ascii: null});
Status.insert({element:'main', status: 'false'});
var x = chess.moves({verbose: true});
var y = [];
for (var i = 0; i < x.length; i++){
    z = x[i].color + "" + x[i].from + "" + x[i].to;
    y.push(z);
}
ValidMoves.insert({element: 'main', moves:y});

Meteor.methods({
    'movePiece': function(move){
        var one = move.substring(0,2);
        var two = move.substring(2);
        console.log(move);
        var m = {from: one, to: two};
        chess.move(m);
        Ascii.update({element: 'main'}, {$set: {ascii: move}});

        updateAll();
        return true;
    }, 

});

function updateAll(){
    Status.update({element: 'main'}, {$set: {status: chess.game_over()}});
    var x2 = chess.moves({verbose: true});
    var y2 = [];
    for (var i = 0; i < x.length; i++){
        z2 = x[i].color + "" + x[i].from + "" + x[i].to;
        y2.push(z2);
    }
    ValidMoves.update({element: 'main'}, {$set: {moves: y2}});
}

if (Meteor.isServer){
    console.log("is server");
    Meteor.publish('board', function boardPublication() {
	    return [Ascii.find({element: 'main'}), Status.find({element: 'main'}), ValidMoves.find({element: 'main'})];
	},

    /*'gameStatus', function gameStatus() {
        var array = [chess.game_over(), chess.ascii(), chess.moves({verbose: true})];
        console.log(array);
        return Status.find({element: 'main'}.status);
    },
    'validMoves', function validMoves() {
        console.log("ldslekwgnw");
        return ValidMoves.find({element: 'main'}).moves;
    }*/);
}