import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  session: service(),

  actions: {
    signIn: function(provider) {
      this.get('session').open('firebase', { provider: provider }).then(function(data) {
        console.log(data.currentUser);
      });
    },
    signOut: function() {
      this.get('session').close();
    }
  }
});
