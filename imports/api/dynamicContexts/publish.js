import { DynContexts } from './collections';

Meteor.publish('dynContexts', function(_id) {
  check(_id, Match.Optional(String));
  console.log('publishing dynContexts', _id);
  const query = { userId: this.userId };
  if (_id) query._id = _id;
  return DynContexts.find(query);
});
