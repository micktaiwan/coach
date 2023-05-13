import './methods';
import './publish';

Accounts.onCreateUser((options, user) => {
  user.createdAt = new Date();
  return user;
});
