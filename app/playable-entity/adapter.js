import ApplicationAdapter from 'firebass/adapters/application';
import { inject as service } from '@ember/service';

export default ApplicationAdapter.extend({
  session: service(),
  pathForType() {
    return this.get('session.currentUser.uid');
  }
});
