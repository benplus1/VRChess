import { Meteor } from 'meteor/meteor';

var Chess = require('chess').Chess;
var chess = new Chess();

Ascii = new Mongo.Collection('ascii');
Status = new Mongo.Collection('status');
ValidMoves = new Mongo.Collection('moves');
Ascii.remove({});
Status.remove({});
ValidMoves.remove({});
a = chess.board();
var q = [];
for (var i = 0; i < 8; i++){
    q.push([]);
    for (var j = 0; j < 8; j++){
        if (a[i][j] == null){
            q[i].push("");
        } else {
            q[i].push(a[i][j].color + "" + a[i][j].type);
        }
    }
}
console.log(q);
Ascii.insert({element: 'main', ascii: q});
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
        console.log(move);
        chess.move({from: move.fromLoc, to: move.toLoc});
        updateAll();
        return true;
    }, 

});

function updateAll(){
    a2 = chess.board();
    var q2 = [];
    for (var i = 0; i < 8; i++){
        q2.push([]);
        for (var j = 0; j < 8; j++){
            if (a[i][j] == null){
                q2[i].push("");
            } else {
                q2[i].push(a2[i][j].color + "" + a2[i][j].type);
            }
        }
    }
    Ascii.update({element: 'main'}, {$set: {ascii: q2}});
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