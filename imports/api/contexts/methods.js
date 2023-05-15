import { Contexts } from './collections';

Meteor.methods({
  addContext(name) {
    check(name, String);

    return Contexts.insert({
      userId: this.userId,
      name,
      createdAt: new Date(),
    });
  },
});
