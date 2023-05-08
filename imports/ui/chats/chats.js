import './chats.html'

import { Chats } from '../../api/chats/collections.js';

Template.chats.onCreated(function() {
  this.autorun(() => {
    this.subscribe('chats', Session.get('contextId'));
  });

});

Template.chats.helpers({
  chats() {
    return Chats.find({}, { sort: { createdAt: 1 } });
  },
});

Template.chats.events({

  'click .js-send-message'(event, instance) {
    event.preventDefault();
    const form = instance.find('#chat-form');
    const message = form.querySelector('textarea[name="message"]').value;
    Session.set('loadingAnswer', true);

    Meteor.call('addChat', Session.get('contextId'), 'user', message, (err, res) => {
      if (err) {
        Meteor.call('addChat', Session.get('contextId'), 'meta', err.message);
        Session.set('loadingAnswer', false);
      }
      else {
        Meteor.call('openaiGenerateText', Session.get('contextId'), '', '', (err, res) => {
          if(err) {
            console.log(err);
            Meteor.call('addChat', Session.get('contextId'), 'meta', err.reason.response.data.error.message);
          }
          else  Meteor.call('addChat', Session.get('contextId'), 'assistant', res);
          Session.set('loadingAnswer', false);
        });

        form.reset();
      }
    });
  },
      
  'click .js-delete-chat'(event, instance) {
    event.preventDefault();
    const chatId = this._id;

    Meteor.call('deleteChat', chatId, (err, res) => {
      if (err) alert(err);
    });
  },

  'click .js-improve-answer'(event, instance) {
    event.preventDefault();
    const message = "Let's work this out in a step by step way to be sure we have the right answer.";
    Meteor.call('addChat', Session.get('contextId'), 'user', message, (err, res) => {
      Meteor.call('openaiGenerateText', Session.get('contextId'), '', '', (err, res) => {
        if(err) {
          console.log(err);
          Meteor.call('addChat', Session.get('contextId'), 'meta', err.reason.response.data.error.message);
        }
        else  Meteor.call('addChat', Session.get('contextId'), 'assistant', res);
      });
    });

  },
});
