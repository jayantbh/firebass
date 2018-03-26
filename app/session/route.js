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
    return this.get('session').fetch().catch(function() {});
  },

  model() {
    if (this.get('session.currentUser.uid')) {
      return RSVP.hash({
        songs: this.getOrCreatePlaylist('my-songs'),
        queue: this.getOrCreatePlaylist('queue')
      });
    }
    return { songs: [], queue: this.createQueue() };
  }
});
