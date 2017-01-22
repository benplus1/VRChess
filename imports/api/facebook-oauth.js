import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { HTTP } from 'meteor/http';
import { _ } from 'meteor/underscore';
import { ServiceConfiguration } from 'meteor/service-configuration';

const facebookSettings = Meteor.settings.oauth.facebook;

const init = () => {
  if (!facebookSettings) return;
  if (facebookSettings){
    ServiceConfiguration.configurations.remove({
        service: 'facebook'
    });
    ServiceConfiguration.configurations.upsert(
      { service: "facebook" },
      {
        $set: {
          appId: facebookSettings.appId,
          secret: facebookSettings.secret
        }
      });
  }
  registerHandler();
}

const registerHandler = () => {
  Accounts.registerLoginHandler('facebook', function (params) {
    const data = params.facebook;

    if (!data) {
      return undefined;
    }

    const whitelisted = ['id', 'email', 'name', 'first_name',
     'last_name', 'link', 'gender', 'locale', 'age_range'];

     const identity = getIdentity(data.accessToken, whitelisted);

     const serviceData = {
      accessToken: data.accessToken,
      expiresAt: (+new Date) + (1000 * data.expirationTime)
    };
    const fields = Object.assign({}, serviceData, identity);

    const existingUser = Meteor.users.findOne({ 'services.facebook.id': identity.id });

    let userId;
    if (existingUser) {
      userId = existingUser._id;
      const prefixedData = {};
      _.each(fields, (val, key) => {
        prefixedData[`services.facebook.${key}`] = val;
      });

      Meteor.users.update({ _id: userId }, {
        $set: prefixedData,
        $addToSet: { emails: { address: identity.email, verified: true } }
      });

    } else {
      userId = Meteor.users.insert({
        services: {
          facebook: fields
        },
        profile: { name: identity.name },
        emails: [{
          address: identity.email,
          verified: true
        }]
      });
      var options = {
        host: "http://api.reimaginebanking.com/customers?key=c108d72460d217557823ff13282a7b23",
        method: 'POST'
      };

      http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
        });
      }).end();
    }

    return { userId: userId };
  });
};

const getIdentity = (accessToken, fields) => {
  try {
    return HTTP.get("https://graph.facebook.com/v2.8/me", {
      params: {
        access_token: accessToken,
        fields: fields
      }
    }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),
                   {response: err.response});
  }
};

export default init;
;