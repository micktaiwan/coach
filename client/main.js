import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Contexts } from '../imports/api/contexts/collections.js';
import { UsageStats } from '../imports/api/open-ai/collections.js';

import '../imports/ui/helpers.js';
import '../imports/ui/tasks/tasks.js';
import '../imports/ui/contexts/contexts.js';
import '../imports/ui/chats/chats.js';
import '../imports/ui/settings/settings.js';

import './main.html';

const route = (name) =>
  FlowRouter.route('/' + name, {
    name,
    action: function () {
      BlazeLayout.render('layout', { main: name });
    },
  });

FlowRouter.route('/', {
  name: 'home',
  action: function () {
    BlazeLayout.render('layout', { main: 'home' });
  },
});

route('contexts');
route('tasks');
route('settings');

Template.home.events({
  'click .js-remove-all-chats'(event, instance) {
    event.preventDefault();
    if (confirm('Are you sure?')) {
      Meteor.call('removeAllChats', Session.get('contextId'), (err, res) => {
        if (err) Meteor.call('addChat', Session.get('contextId'), 'meta', err.message);
      });
    }
  },

  'click .js-find-priority'(event, instance) {
    event.preventDefault();
    const prompt =
      'Find the priorities among my current tasks and justify them with pros and cons.\n' +
      "Let's start by reviewing all the tasks and categorizing them based on their urgency and importance.\n"+
      "Then we can prioritize them based on their impact.\n" +
      'Use this format: "[original_task_number] [short summary of the task]: [justification]".\n' +
      // "Once you have a list of prioritized tasks, you can discuss the pros and cons of each and decide on the top three.\n";
      'Give maximum 3 priority items. The justification for each of them can be of any length.\n' +
      'Do not give any meta explanation of the process.\n';
    Meteor.call('addChat', Session.get('contextId'), 'user', prompt);
    Meteor.call('openaiGenerateText', Session.get('contextId'), '', prompt, (err, res) => {
			if(err) {
				console.log(err); 
				Meteor.call('addChat', Session.get('contextId'), 'meta', err.reason.response.data.error.message);
			}
      else Meteor.call('addChat', Session.get('contextId'), 'assistant', res);
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

Template.contextSelect.onCreated(function () {
  this.autorun(() => {
    this.subscribe('contexts', Session.get('contextId'));
  });
});

Template.contextSelect.helpers({
  contexts() {
    return Contexts.find({}, { sort: { createdAt: 1 } });
  },
});

Template.contextSelect.events({
  'change [name=context-select]'(event, instance) {
    event.preventDefault();
    const contextId = event.target.value;
    if(!contextId) return;

    console.log('contextId', contextId);

    if(contextId === 'new') {
      const name = prompt('Enter a name for the new context:', '');
      Meteor.call('addContext', name);
      return;
    }
    Session.set('contextId', contextId);
  }
});
