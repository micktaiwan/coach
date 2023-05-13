import { Template } from 'meteor/templating';
import { Contexts } from '../imports/api/contexts/collections';

import '../imports/ui/helpers';
import '../imports/ui/home/home';
import '../imports/ui/tasks/tasks';
import '../imports/ui/contexts/contexts';
import '../imports/ui/chats/chats';
import '../imports/ui/settings/settings';

import './routes';
import '../imports/ui/dyn-contexts/dyn-contexts';
import './layout/layout';

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
  'change [name=context-select]'(event) {
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
  'click .js-add-dyn-context'(event) {
    event.preventDefault();
    const name = prompt('Enter a name for the new dyn context');
    if (name) {
      Meteor.call('addDynContext', name, (err, res) => {
        console.log('addDynContext', err, res);
        if (err) Meteor.call('addChat', Session.get('contextId'), 'meta', err.message);
      });
    }
  },
});
