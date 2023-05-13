import { DynContexts } from './collections';

Meteor.publish('dynContexts', function(_id) {
  check(_id, Match.Optional(String));
  const query = { userId: this.userId };
  if (_id) query._id = _id;
  return DynContexts.find(query);
});
