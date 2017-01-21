import { Meteor } from 'meteor/meteor';
import validMoves from '../startup/board';

var Chess = require('./chess').Chess;
var chess = new Chess();

Meteor.methods({
    'movePiece': function(move){
        chess.move({from: move.fromLoc, to: move.toLoc});
    }
});

if (Meteor.isServer){
	Meteor.publish('board', function boardPublication() {
		return chess.board();
	});
    Meteor.publish('validMoves', function validMoves() {
        return chess.moves({verbose: true});
    });
    Meteor.publish('gameStatus', function gameStatus() {
        return chess.game_over();
    })
}