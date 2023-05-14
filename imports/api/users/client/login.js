import { FlowRouter } from 'meteor/kadira:flow-router';
import './login.html';

Template.login.onCreated(() => { });

Template.login.onRendered(() => { });

Template.login.onDestroyed(() => { });

Template.login.helpers({});

Template.login.events({

  'submit'(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    Session.set('contextId', undefined);

    Meteor.loginWithPassword(email, password, err => {
      if (err) {
        console.log('loginWithPassword', err);
        if (err.reason === 'User not found') {
          Meteor.call('appCreateUser', email, password, (err, res) => {
            console.log('createUser', err, res);
            if (!err) {
              Meteor.loginWithPassword(email, password, err => {
                if (err) console.log('loginWithPassword', err);
                else FlowRouter.go('/');
              });
            }
          });
        } else {
          alert(err.reason);
        }
      } else {
        FlowRouter.go('/');
      }
    });
  },
});
