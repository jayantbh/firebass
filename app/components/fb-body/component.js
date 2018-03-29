import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { ytObjectToPlayableEntityModel } from 'firebass/lib/yt-object';
import EmberObject, { computed } from '@ember/object';


export default Component.extend({
  tagName: '',

  searchTerm: '',
  video: null,
  searchResults: null,
  songs: null,
  queue: null,
  playlists: () => [],

  store: service(),

  indexOfTrackInCurrentPlaylist: computed('video', 'queue', function () {
    return this.get('queue.entities').indexOf(this.video);
  }),

  nextTrackInCurrentPlaylist: computed('indexOfTrackInCurrentPlaylist', function () {
    let index = this.get('indexOfTrackInCurrentPlaylist') + 1;
    if (index === this.get('queue.entities.length')) return null;
    return this.get('queue.entities').objectAt(index);
  }),

  addSong: task(function * (video) {
    let song = this.get('store').createRecord('playable-entity', ytObjectToPlayableEntityModel(video));
    return yield song.save();
  }).drop(),

  actions: {
    addToList: async function (track, list) {
      let song;
      if (!(track instanceof EmberObject)) {
        song = await this.get('addSong').perform(track).catch(() => {});
      } else { song = track; }

      if (list instanceof EmberObject) {
        list.get('entities').addObject(song);
        list.save();
      } else {
        this.get(`${list}.entities`).addObject(song);
        this.get(list).save();
      }
    },

    removeSong(song, source) {
      source.get('entities').removeObject(song);
      source.save();
    },

    onVideoEnded() {
      let nextTrackInCurrentPlaylist = this.get('nextTrackInCurrentPlaylist');
      this.set('video', nextTrackInCurrentPlaylist);
    }
  }
});
