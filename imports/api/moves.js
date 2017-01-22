import { Meteor } from 'meteor/meteor';
import validMoves from '../startup/board';

var Chess = require('chess').Chess;
var chess = new Chess();

Ascii = new Mongo.Collection('ascii');
Status = new Mongo.Collection('status');
ValidMoves = new Mongo.Collection('moves');
Ascii.remove();
Status.remove();
ValidMoves.remove();
Ascii.insert({element: 'main', ascii:chess.ascii()});
Status.insert({element:'main', status: 'false'});
ValidMoves.insert({element: 'main', moves:chess.moves()});

Meteor.methods({
    'movePiece': function(move){
        console.log(move);
        chess.move({from: move.fromLoc, to: move.toLoc});
        updateAll();
        return true;
    }, 

});

function updateAll(){
    Ascii.update({element: 'main'}, {$set: {ascii: chess.ascii()}});
    Status.update({element: 'main'}, {$set: {status: chess.game_over()}});
    ValidMoves.update({element: 'main'}, {$set: {moves: chess.moves({verbose: true})}});
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