import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Contexts } from '../imports/api/contexts/collections.js';

import '../imports/ui/helpers.js';

import './main.html';
import '../imports/ui/tasks/tasks.js';
import '../imports/ui/contexts/contexts.js';
import '../imports/ui/chats/chats.js';
import '../imports/ui/settings/settings.js';

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
      Meteor.call('removeAllChats', (err, res) => {
        if (err) Meteor.call('addChat', Session.get('contextId'), 'meta', err.message);
      });
    }
  },

  'click .js-find-priority'(event, instance) {
    event.preventDefault();
    const prompt =
      'Find the priorities among my current tasks and justify them with pros and cons.\n' +
      'Use this format: "[original_task_number] [max 4 words summary of the task]: [justification]".\n' +
      'Give maximum 3 priority items. The justification for each of them can be of any length.\n';
    Meteor.call('addChat', Session.get('contextId'), 'user', prompt);
    Meteor.call('openaiGenerateText', Session.get('contextId'), '', prompt, (err, res) => {
      if (err) Meteor.call('addChat', Session.get('contextId'), 'meta', err.message);
      else Meteor.call('addChat', Session.get('contextId'), 'assistant', res);
    });
  },
});

Template.usageStats.onRendered(function () {
  Meteor.call('getUsageStats', (err, res) => {
    console.log('method', res);
    Session.set('usageStats', res);
  });
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

    if(contextId === 'new') {
      const name = prompt('Enter a name for the new context:', '');
      Meteor.call('addContext', name);
      return;
    }
    Session.set('contextId', contextId);
  }
});
