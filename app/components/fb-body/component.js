import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { ytObjectToPlayableEntityModel } from 'firebass/lib/yt-object';
import EmberObject, { computed } from '@ember/object';
import { or } from '@ember/object/computed';


export default Component.extend({
  tagName: '',

  searchTerm: '',
  track: null,
  searchResults: null,
  playlist: null,
  playlists: () => [],

  store: service(),

  queue: null,
  _queue: null, // required to fix an issue where updating the queue's entities causes it to have the old records for a moment.
  __queue: or('_queue', 'queue'),

  indexOfTrackInCurrentPlaylist: computed('track', '__queue', function () {
    return this.get('__queue.entities').indexOf(this.track.content || this.track);
  }),

  nextTrackInCurrentPlaylist: computed('indexOfTrackInCurrentPlaylist', function () {
    let index = this.get('indexOfTrackInCurrentPlaylist') + 1;
    if (index === this.get('__queue.entities.length')) return null;
    return this.get('__queue.entities').objectAt(index);
  }),

  addSong: task(function * (track) {
    let song = this.get('store').createRecord('playable-entity', ytObjectToPlayableEntityModel(track));
    return yield song.save();
  }).drop(),

  updateQueue: task(function * (queue, tracks, track, playlist) {
    this.set('_queue', playlist);

    queue.set('entities', tracks);
    queue.set('currentTrack', track);
    yield queue.save();

    this.set('_queue', null);
    return queue;
  }).restartable(),

  actions: {
    addToList: async function (track, playlist) {
      let song;
      if (!(track instanceof EmberObject)) {
        song = await this.get('addSong').perform(track).catch(() => {});
      } else { song = track; }

      if (!(playlist instanceof EmberObject)) { playlist = this.get(playlist); }

      playlist.get('entities').addObject(song);
      await playlist.save();
      song.get('playlists').addObject(playlist);
      song.save();
    },

    removeSong: async function (track, playlist) {
      playlist.get('entities').removeObject(track);
      await playlist.save();
      track.get('playlists').removeObject(playlist);
      track.save();
    },

    onVideoEnded() {
      let nextTrackInCurrentPlaylist = this.get('nextTrackInCurrentPlaylist');
      this.set('track', nextTrackInCurrentPlaylist);
      let queue = this.get('__queue');
      queue.set('currentTrack', nextTrackInCurrentPlaylist);
      queue.save();
    },

    onPlaylistItemSelected (track, playlist) {
      this.set('track', track);

      let tracks = playlist.get('entities');
      let queue = this.get('__queue');

      if (playlist === queue) { return; }
      this.get('updateQueue').perform(queue, tracks, track, playlist);
    }
  }
});
