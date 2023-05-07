import { Chats } from './collections.js';

Meteor.publish('chats', function(contextId) {
  return Chats.find({contextId, userId: this.userId});
});
