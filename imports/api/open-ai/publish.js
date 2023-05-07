import { UsageStats } from './collections.js';

Meteor.publish('usage_stats', function(contextId) {
  return UsageStats.find({ contextId, userId: this.userId }, { sort: { createdAt: -1 }, limit: 1 });
});
