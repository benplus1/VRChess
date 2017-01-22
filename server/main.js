import { Meteor } from 'meteor/meteor';
import '../imports/api/moves';
import OauthInit from '../imports/api/facebook-oauth.js';
 
Meteor.startup(() => {
  OauthInit();
});
