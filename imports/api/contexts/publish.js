import { Contexts } from './collections.js';

Meteor.publish('contexts', function() {
  return Contexts.find({userId: this.userId});
});
