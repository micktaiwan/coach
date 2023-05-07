import { PrimaryContexts } from '../../api/primary-contexts/collections.js';
import Sortable from 'sortablejs/modular/sortable.complete.esm.js';

import { exportCollection } from '../../api/helpers.js';

import './contexts.html';

Template.contexts.onCreated(function () {
  this.autorun(() => {
    this.subscribe('primary_contexts', Session.get('contextId'));
  });
});

Template.contexts.onRendered(function () {
  const el = document.getElementById('contexts');
  const sortable = Sortable.create(el, {
    onEnd: function (event) {
      const sortedIds = sortable.toArray();

      sortedIds.forEach(function (id, index) {
        Meteor.call('updateContext', id, { priority: index });
      });
    },
  });
});

Template.contexts.helpers({
  contexts() {
    return PrimaryContexts.find({contextId: Session.get('contextId')}, { sort: { priority: 1 } });
  },
});

Template.contexts.events({
  'click .js-add-context'(event, instance) {
    event.preventDefault();
    const form = instance.find('#context-form');
    const inputs = form.querySelectorAll('input, textarea');
    const context = {};

    inputs.forEach((input) => {
      context[input.name] = input.value;
    });

    if (context.text === '') return;

    Meteor.call('addPrimaryContext', context, Session.get('contextId'), (err, res) => {
      if (err) {
        alert(err);
      } else {
        form.reset();
        inputs[0].focus();
      }
    });
  },

});

Template.context.helpers({
  contextClass() {
    return '';
  },
  date() {
    return this.createdAt.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },
});

Template.context.events({
  'click .js-delete-context'(event, instance) {
    event.preventDefault();
    Meteor.call('deleteContext', this._id);
  },

  'keydown span[contenteditable]': function (event, template) {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  },

  'blur span[contenteditable]': function (event, template) {
    const newText = event.currentTarget.textContent.trim();
    if (newText !== '') Meteor.call('editContextText', this._id, newText);
    else event.currentTarget.textContent = this.text;
  },

});
