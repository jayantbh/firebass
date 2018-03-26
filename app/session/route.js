import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { capitalize } from '@ember/string';

export default Route.extend({
  session: service(),

  createPlaylist(type) {
    return this.store.createRecord('playlist', {
      name: type.split('-').map(capitalize).join(' '),
      createdAt: new Date().getTime(),
      type, access: 'private'
    });
  },

  getOrCreatePlaylist: async function (type) {
    let playlist;

    try {
      playlist = await this.store.query('playlist', { orderBy: 'type', equalTo: type });
      if (playlist.get('length')) return playlist.get('firstObject');
    } catch (e) { /* do nothing */ }


    playlist = this.createPlaylist(type);
    await playlist.save();
    return playlist
  },

  beforeModel: function() {
    // If no session exists, or attempting to access session throws an error, redirect to signin route
    try {
      // If session is not authenticated, attempt to fetch a new session, else do nothing and stay on route
      // If session fetching fails, redirect to signin route
      if (!this.get('session.isAuthenticated')) {
        return this.get('session').fetch().catch(() => {
          this.transitionTo('signin');
        });
      }
    } catch (e) {
      this.transitionTo('signin');
    }
  },

  model() {
    return RSVP.hash({
      songs: this.getOrCreatePlaylist('my-songs'),
      queue: this.getOrCreatePlaylist('queue')
    });
  }
});
