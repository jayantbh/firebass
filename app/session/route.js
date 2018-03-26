import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';

export default Route.extend({
  session: service(),

  createQueue() {
    return this.store.createRecord('playlist', {
      name: 'Queue',
      entities: [],
      createdAt: new Date().getTime(),
      type: 'queue',
      access: 'private'
    });
  },

  getOrCreateQueuePlaylist: task(function * () {
    try {
      let queue = yield this.store.query('playlist', { type: 'queue' });
      if (queue) return queue;
    } catch (e) { /* do nothing */ }

    let queue = this.createQueue();
    return yield queue.save();
  }).drop(),

  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },

  model() {
    if (this.get('session.currentUser.uid')) {
      return RSVP.hash({
        songs: this.store.findAll('playable-entity'),
        queue: this.get('getOrCreateQueuePlaylist').perform()
      });
    }
    return { songs: [], queue: this.createQueue() };
  }
});
