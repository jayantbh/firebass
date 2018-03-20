import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  session: service(),

  init() {
    this._super(...arguments);
    // var newPost = this.get('store').createRecord('post', {
    //   title: 'EmberFire is flaming hot!',
    //   body: 'You can store and sync data in realtime without a backend.'
    // });
    // newPost.save();
  },
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
