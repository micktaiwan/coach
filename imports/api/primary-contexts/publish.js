import { PrimaryContexts } from './collections.js';

Meteor.publish('primary_contexts', function(contextId, dynContextId) {
  // console.log('publishing primary_contexts', contextId, dynContextId || { $exists: false });
  return PrimaryContexts.find({ contextId, userId: this.userId, dynContextId: dynContextId || { $exists: false } });
});
