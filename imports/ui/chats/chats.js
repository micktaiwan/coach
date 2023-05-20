import './chats.html';

import { Chats } from '../../api/chats/collections';
import { DynContexts } from '../../api/dynamicContexts/collections';
import { getDynContexts } from '../helpers';

let handle;
const scrollToBottom = () => {
  if (handle) Meteor.clearTimeout(handle);
  handle = Meteor.setTimeout(() => {
    const chats = document.querySelector('.chats');
    if (chats) chats.scrollTop = chats.scrollHeight;
  }, 100);
};

Template.chats.onCreated(function() {
  this.autorun(() => {
    this.subscribe('chats', Session.get('contextId'));
    // when detecting that theres more documents in the Chats collection then scroll to bottom
    Chats.find().observeChanges({
      added() {
        scrollToBottom();
      },
    });
  });
});

Template.chats.helpers({
  chats() {
    return Chats.find({}, { sort: { createdAt: 1 } });
  },
  contexts() {
    const contexts = ['Main'];
    contexts.push(...getDynContexts());
    return contexts.map(context => {
      if (context === 'Main') return 'Main';
      if (context === 'tasks') return 'Tasks';
      return DynContexts.findOne(context).name;
    }).join(', ');
  },
});

Template.chats.events({

  'click .js-send-message'(event, instance) {
    event.preventDefault();
    const form = instance.find('#chat-form');
    const message = form.querySelector('textarea[name="message"]').value;
    Session.set('loadingAnswer', true);

    Meteor.call('addChat', Session.get('contextId'), 'user', message, err => {
      if (err) {
        Meteor.call('addChat', Session.get('contextId'), 'meta', err.message);
        Session.set('loadingAnswer', false);
      } else {
        Meteor.call('openaiGenerateText', Session.get('contextId'), getDynContexts(), '', '', (err2, res) => {
          if (err2) {
            console.log(err2);
            if (typeof err2.reason === 'string') Meteor.call('addChat', Session.get('contextId'), 'meta', err2.reason);
            else Meteor.call('addChat', Session.get('contextId'), 'meta', err2.reason.response.data.error.message);
          } else {
            Meteor.call('addChat', Session.get('contextId'), 'assistant', res);
          }
          Session.set('loadingAnswer', false);
        });
        form.reset();
      }
    });
  },

  'keypress textarea[name="message"]'(event, instance) {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      instance.find('.js-send-message').click();
    }
  },

  'click .js-delete-chat'(event) {
    event.preventDefault();
    const chatId = this._id;

    Meteor.call('deleteChat', chatId, err => {
      if (err) alert(err);
    });
  },

  'click .js-improve-answer'(event) {
    event.preventDefault();
    // const message = "Let's work this out in a step by step way to be sure we have the right answer.";
    const message = 'Can you please provide additional evidence or examples to support your previous statement and further strengthen your argument?';
    Session.set('loadingAnswer', true);
    Meteor.call('addChat', Session.get('contextId'), 'user', message, () => {
      Meteor.call('openaiGenerateText', Session.get('contextId'), getDynContexts(), '', '', (err, res) => {
        if (err) {
          console.log(err);
          Meteor.call('addChat', Session.get('contextId'), 'meta', err.reason.response.data.error.message);
        } else Meteor.call('addChat', Session.get('contextId'), 'assistant', res);
        Session.set('loadingAnswer', false);
      });
    });
  },
});

Template.floatingChat.onCreated(function() {
  this.show = new ReactiveVar(false);
});

Template.floatingChat.helpers({
  show() {
    const show = Template.instance().show.get();
    if (show) scrollToBottom();
    return show;
  },
});

Template.floatingChat.events({
  'click .js-toggle-chat'(event, instance) {
    event.preventDefault();
    const show = instance.show.get();
    instance.show.set(!show);
  },
});
