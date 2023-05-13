import { FlowRouter } from 'meteor/kadira:flow-router';

import './header.html';
import './footer.html';
import './layout.html';

Template.layout.helpers({
  activeRoute(path) {
    FlowRouter.watchPathChange();
    return FlowRouter.current().path === path ? 'active' : '';
  },

  activeRouteBoolean(path) {
    FlowRouter.watchPathChange();
    return FlowRouter.current().path === path;
  },
});

Template.layout.events({
  'click #collaspe-view'() {
    document.body.classList.toggle('sidebar-collapse');
  },
});
