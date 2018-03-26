import FirebaseAdapter from 'emberfire/adapters/firebase';
import { inject as service } from '@ember/service';

export default FirebaseAdapter.extend({
  session: service(),
  pathForType() {
    return this.get('session.currentUser.uid');
  }
});
