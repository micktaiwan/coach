import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

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
        if (err) Meteor.call('addChat', 'meta', err.message);
      });
    }
  },

  'click .js-find-priority'(event, instance) {
    event.preventDefault();
    const prompt =
      'Find the priorities among my current tasks and justify them with pros and cons.\n' +
      'Use this format: "[original_task_number] [max 4 words summary of the task]: [justification]".\n' +
      'Give maximum 3 priority items. The justification for each of them can be of any length.\n';
    Meteor.call('addChat', 'user', prompt);
    Meteor.call('openaiGenerateText', '', prompt, (err, res) => {
      if (err) Meteor.call('addChat', 'meta', err.message);
      else Meteor.call('addChat', 'assistant', res);
    });
  },
});

Template.usageStats.onRendered(function () {
  Meteor.call('getUsageStats', (err, res) => {
    console.log('method', res);
    Session.set('usageStats', res);
  });
});
