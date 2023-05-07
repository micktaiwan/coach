import { PrimaryContexts } from './collections.js';

Meteor.publish('primary_contexts', function(contextId) {
  return PrimaryContexts.find({contextId, userId: this.userId});
});
