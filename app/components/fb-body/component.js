import Component from '@ember/component';
import fetch from 'fetch';
import ENV from 'firebass/config/environment';
import { task, timeout } from 'ember-concurrency';

const YOUTUBE_ID_REGEX = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
const DEBOUNCE_DURATION = 500;

export default Component.extend({
  tagName: '',

  searchTerm: 'https://www.youtube.com/watch?v=oWCrc3MwXPI',
  videoId: '',
  searchResults: null,

  // Allow searching for either just videos, or videos and playlists, or just playlists
  searchType: 'video', // Planned: playlist | video,playlist

  // store: service(),

  init() {
    this._super(...arguments);
    // var newPost = this.get('store').createRecord('post', {
    //   title: 'EmberFire is flaming hot!',
    //   body: 'You can store and sync data in realtime without a backend.'
    // });
    // newPost.save();
    // this.get('searchYoutube').perform('veritasium').then(console.log)
  },

  searchYoutube: task(function * (term) {
    yield timeout(DEBOUNCE_DURATION);
    return yield fetch(`https://www.googleapis.com/youtube/v3/search?key=${ENV.FIREBASS_GOOGLE_API_KEY}&type=${this.searchType}&part=snippet&q=${term}`).then(function(response) {
      return response.json();
    });
  }).restartable(),

  actions: {
    updateVideoId(event) {
      event.preventDefault();

      let searchTerm = this.get('searchTerm');
      let [, videoId] = searchTerm.match(YOUTUBE_ID_REGEX);
      this.set('videoId', videoId);
    },

    handleSearchInput(value) {
      this.set('searchTerm', value);
      let videoId;
      try {
        [, videoId] = value.match(YOUTUBE_ID_REGEX);
      } catch(e) {
      //  do nothing
      }

      this.get('searchYoutube').perform(videoId || value).then((results) => this.set('searchResults', results)).catch(() => {});
    }
  }
});
