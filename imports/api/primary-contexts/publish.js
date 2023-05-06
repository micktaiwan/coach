import { PrimaryContexts } from './collections.js';

Meteor.publish('primary_contexts', function() {
  return PrimaryContexts.find();
});
