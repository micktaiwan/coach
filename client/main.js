import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Contexts } from '../imports/api/contexts/collections';
import { UsageStats } from '../imports/api/open-ai/collections';


import '../imports/ui/helpers';
import '../imports/ui/tasks/tasks';
import '../imports/ui/contexts/contexts';
import '../imports/ui/chats/chats';
import '../imports/ui/settings/settings';

import './routes';
import '../imports/ui/dyn-contexts/dyn-contexts';
import './main.html';

// LAYOUT

Template.layout.helpers({
  activeRoute (path) {
    FlowRouter.watchPathChange();
    return FlowRouter.current().path === path ? 'active' : '';
  },
});

Template.home.events({
  'click .js-remove-all-chats' (event) {
    event.preventDefault();
    if (confirm('Are you sure?')) {
      Meteor.call('removeAllChats', Session.get('contextId'), (err, res) => {
        if (err) Meteor.call('addChat', Session.get('contextId'), 'meta', err.message);
      });
    }
  },

  'click .js-find-priority' (event) {
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
    Meteor.call('openaiGenerateText', Session.get('contextId'), '', prompt, (err, res) => {
      if (err) {
        console.log(err);
        Meteor.call('addChat', Session.get('contextId'), 'meta', err.reason.response.data.error.message);
      } else {
        Meteor.call('addChat', Session.get('contextId'), 'assistant', res);
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
  usageStats () {
    return UsageStats.find({}, { sort: { createdAt: -1 }, limit: 1 });
  },
});

Template.contextSelect.onCreated(function () {
  this.autorun(() => {
    this.subscribe('contexts', Session.get('contextId'));
  });
});

Template.contextSelect.helpers({
  contexts () {
    return Contexts.find({}, { sort: { createdAt: 1 } });
  },
});

Template.contextSelect.events({
  'change [name=context-select]' (event) {
    event.preventDefault();
    const contextId = event.target.value;
    if (!contextId) return;

    console.log('contextId', contextId);

    if (contextId === 'new') {
      const name = prompt('Enter a name for the new context:', '');
      Meteor.call('addContext', name);
      return;
    }
    Session.set('contextId', contextId);
  },
});


Template.layout.events({
  'click .js-add-dyn-context' (event) {
    event.preventDefault();
    const name = prompt('Enter a name for the new context');
    if (name) {
      Meteor.call('addDynContext', name, (err, res) => {
        console.log('addDynContext', err, res);
        if (err) Meteor.call('addChat', Session.get('contextId'), 'meta', err.message);
      });
    }
  },
});
