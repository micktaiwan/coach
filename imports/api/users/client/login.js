import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './login.html';

Template.login.onCreated(function () { });

Template.login.onRendered(function () { });

Template.login.onDestroyed(function () { });

Template.login.helpers({});

Template.login.events({

  'submit'(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

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
        }
        else {
          alert(err.reason);
        }
      }
      else {
        FlowRouter.go('/');
      }
    });
  },
});
