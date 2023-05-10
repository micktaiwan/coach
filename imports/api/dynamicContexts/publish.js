import { DynContexts } from './collections';

Meteor.publish('dynContexts', function() {
  return DynContexts.find({ userId: this.userId });
});
