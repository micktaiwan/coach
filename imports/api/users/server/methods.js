Meteor.methods({
  'appCreateUser'(email, password) {
    check(email, String);
    check(password, String);
    Accounts.createUser({
      email,
      password,
    });
  },
});
