import { Meteor } from 'meteor/meteor';
import '../imports/api/moves';

//import OauthInit from '../imports/api/facebook-oauth.js';
import {movesInit} from '../imports/api/moves.js'

Meteor.startup(() => {
  movesInit();
});
