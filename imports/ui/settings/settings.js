import { exportCollection } from '../../api/helpers.js';

import './settings.html';

Template.settings.helpers({
  selectedModel(model) {
    return Meteor.user()?.openAI?.model === model ? 'selected' : '';
  },
});

Template.settings.events({
  'click .js-set-api-key'(event) {
    event.preventDefault();
    const apiKey = document.querySelector('#api-key').value;
    const model = document.querySelector('#model').value;
    Meteor.call('setModel', model);
    Meteor.call('setApiKey', apiKey);
  },

  'click .js-export-tasks'(event) {
    event.preventDefault();
    exportCollection('tasks', { contextId: Session.get('contextId') } );
  },

  'click .js-export-contexts'(event) {
    event.preventDefault();
    exportCollection('primary_contexts', { contextId: Session.get('contextId') });
  },

  'click .js-import-tasks'(event) {
    event.preventDefault();
    const tasksJSON = document.querySelector('#import-tasks').value;
    Meteor.call('importTasks', Session.get('contextId'), tasksJSON);
  },

  'click .js-import-primary-contexts'(event) {
    event.preventDefault();
    const contextsJSON = document.querySelector('#import-primary-contexts').value;
    Meteor.call('importPrimaryContexts', Session.get('contextId'), contextsJSON);
  },
});
