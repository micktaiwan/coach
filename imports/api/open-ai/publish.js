import { UsageStats } from './collections';

Meteor.publish('usage_stats', function(contextId) {
  check(contextId, String);
  return UsageStats.find({ contextId, userId: this.userId }, { sort: { createdAt: -1 }, limit: 1 });
});
