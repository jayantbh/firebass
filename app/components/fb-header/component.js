import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  session: service(),
  router: service(),

  actions: {
    signOut: async function() {
      await this.get('session').close();
      this.get('router').transitionTo('signin');
    }
  }
});
