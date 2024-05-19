import { UsageStats } from './collections';

Meteor.publish('usage_stats', function(contextId) {
  if (!this.userId) return this.ready();
  if (!contextId) return this.ready();
  check(contextId, String);
  return UsageStats.find({ contextId, userId: this.userId }, { sort: { createdAt: -1 }, limit: 1 });
});
