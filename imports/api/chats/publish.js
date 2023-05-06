import { Chats } from './collections.js';

Meteor.publish('chats', function() {
  return Chats.find();
});
