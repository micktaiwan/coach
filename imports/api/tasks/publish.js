import { Tasks } from './collections';

Meteor.publish('tasks', function(contextId) {
  check(contextId, String);
  return Tasks.find({ contextId, userId: this.userId });
});
