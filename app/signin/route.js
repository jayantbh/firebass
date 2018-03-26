import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel: function() {
    // If no session exists, or attempting to access session throws an error, do nothing and stay on route
    try {
      // If session.isAuthenticated is `false`, that means a previous session fetch was attempted, hence do nothing more and stay on route
      if (this.get('session.isAuthenticated') === false) return;

      // If session is not authenticated (unset | undefined or null), attempt fetching new session, else redirect to session route
      // If session fetching passes, redirect to session route, else do nothing and stay on route
      if (!this.get('session.isAuthenticated')) {
        return this.get('session').fetch().then(() => {
          this.transitionTo('session');
        }).catch (() => { /* do nothing */ });
      } else {
        this.transitionTo('session');
      }
    } catch (e) { /* do nothing */ }
  }
});
