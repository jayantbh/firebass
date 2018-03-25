import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),
  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },
  model() {
    if (this.get('session.currentUser.uid')) {
      return this.store.findAll('playable-entity');
    }
    return [];
  }
});
