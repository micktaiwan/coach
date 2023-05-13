import { PrimaryContexts } from './collections.js';

Meteor.publish('primary_contexts', function(contextId, dynContextId) {
  return PrimaryContexts.find({ contextId, userId: this.userId, dynContextId: dynContextId || { $exists: false } });
});
