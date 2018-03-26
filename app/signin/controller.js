import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  actions: {
    signIn: function(provider) {
      this.get('session').open('firebase', { provider: provider }).then(() => {
        this.transitionToRoute('session');
      });
    }
  }
});
