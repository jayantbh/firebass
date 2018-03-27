import Component from '@ember/component';
import fetch from 'fetch';
import ENV from 'firebass/config/environment';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { ytObjectToPlayableEntityModel } from 'firebass/lib/yt-object'

const YOUTUBE_ID_REGEX = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
const DEBOUNCE_DURATION = 500;

export default Component.extend({
  tagName: '',

  searchTerm: '',
  video: null,
  searchResults: null,
  songs: null,
  queue: null,

  // Allow searching for either just videos, or videos and playlists, or just playlists
  searchType: 'video', // Planned: playlist | video,playlist

  store: service(),

  searchYoutube: task(function * (term) {
    if (!term.length) return;
    yield timeout(DEBOUNCE_DURATION);
    return yield fetch(`https://www.googleapis.com/youtube/v3/search?key=${ENV.FIREBASS_GOOGLE_API_KEY}&type=${this.searchType}&part=snippet&q=${term}`).then(function(response) {
      return response.json();
    });
  }).restartable(),

  addSong: task(function * (video) {
    let song = this.get('store').createRecord('playable-entity', ytObjectToPlayableEntityModel(video));
    return yield song.save();
  }).drop(),

  actions: {
    handleSearchInput(value) {
      this.set('searchTerm', value);
      let videoId;
      try {
        [, videoId] = value.match(YOUTUBE_ID_REGEX);
      } catch(e) {
      //  do nothing
      }

      this.get('searchYoutube').perform(videoId || value).then((results) => this.set('searchResults', results)).catch(() => {});
    },

    addToList: async function (track, list) {
      let song;
      if (!track.id) {
        song = await this.get('addSong').perform(track).catch(() => {});
      } else { song = track; }

      this.get(`${list}.entities`).addObject(song);
      this.get(list).save();
    },

    removeSong(song, source) {
      source.get('entities').removeObject(song);
      source.save();
    }
  }
});
