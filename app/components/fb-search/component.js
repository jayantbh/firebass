import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import fetch from 'fetch';
import ENV from 'firebass/config/environment';

const YOUTUBE_ID_REGEX = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
const DEBOUNCE_DURATION = 500;

export default Component.extend({
  tagName: '',

  searchTerm: '',
  searchResults: null,
  playlist: null,
  queue: null,
  handleSearchInput: () => {},
  addToList: () => {},

  // Allow searching for either just videos, or videos and playlists, or just playlists
  searchType: 'video', // Planned: playlist | video,playlist

  searchYoutube: task(function * (term) {
    if (!term.length) return;
    yield timeout(DEBOUNCE_DURATION);
    return yield fetch(`https://www.googleapis.com/youtube/v3/search?key=${ENV.FIREBASS_GOOGLE_API_KEY}&type=${this.searchType}&part=snippet&q=${term}`).then(function(response) {
      return response.json();
    });
  }).restartable(),

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
    }
  }
});
