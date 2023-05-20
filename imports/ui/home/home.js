
import { UsageStats } from '../../api/open-ai/collections';

import './home.html';

Template.home.events({
  'click .js-remove-all-chats'(event) {
    event.preventDefault();
    if (confirm('Are you sure?')) {
      Meteor.call('removeAllChats', Session.get('contextId'), (err, res) => {
        if (err) Meteor.call('addChat', Session.get('contextId'), 'meta', err.message);
      });
    }
  },

  'click .js-find-priority'(event) {
    event.preventDefault();
    const prompt =
      'Find the priorities among my current tasks and justify them with pros and cons.\n' +
      'Let\'s start by reviewing all the tasks and categorizing them based on their urgency and importance.\n' +
      'Then we can prioritize them based on their impact.\n' +
      'Use this format: "[original_task_number] [short summary of the task]: [justification]".\n' +
      // "Once you have a list of prioritized tasks, you can discuss the pros and cons of each and decide on the top three.\n";
      'Give maximum 3 priority items. The justification for each of them can be of any length.\n' +
      'Do not give any meta explanation of the process.\n';
    Meteor.call('addChat', Session.get('contextId'), 'user', prompt);
    Session.set('loadingAnswer', true);
    Meteor.call('openaiGenerateText', Session.get('contextId'), '', '', (err, res) => {
      if (err) {
        console.log(err);
        Meteor.call('addChat', Session.get('contextId'), 'meta', err.reason.response.data.error.message);
      } else {
        Meteor.call('addChat', Session.get('contextId'), 'assistant', res.response);
      }
      Session.set('loadingAnswer', false);
    });
  },

});

Template.usageStats.onCreated(function () {
  this.autorun(() => {
    this.subscribe('usage_stats', Session.get('contextId'));
  });
});

Template.usageStats.helpers({
  usageStats() {
    return UsageStats.find({}, { sort: { createdAt: -1 }, limit: 1 });
  },
});
