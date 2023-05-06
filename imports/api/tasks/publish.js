import { Tasks } from './collections.js';

Meteor.publish('tasks', function() {
  return Tasks.find();
});
