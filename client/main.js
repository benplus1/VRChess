import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    Meteor.subscribe('board', () => {
      console.log(new Mongo.Collection('moves').find().fetch());
    });
    console.log(Meteor.userId());
    Meteor.call('dummyMethod');
    instance.counter.set(instance.counter.get() + 1);
  },
});
