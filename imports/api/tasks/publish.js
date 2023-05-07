import { Tasks } from './collections.js';

Meteor.publish('tasks', function(contextId) {
  return Tasks.find({contextId, userId: this.userId});
});
