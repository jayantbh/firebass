import Component from '@ember/component';
import fetch from 'fetch';
import ENV from 'firebass/config/environment';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';

const YOUTUBE_ID_REGEX = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
const DEBOUNCE_DURATION = 500;

export default Component.extend({
  tagName: '',

  searchTerm: 'https://www.youtube.com/watch?v=oWCrc3MwXPI',
  videoId: '',
  searchResults: null,
  songs: null,

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
    let song = this.get('store').createRecord('playable-entity', {
      videoId: video.id.videoId,
      kind: video.id.kind,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high.url || video.snippet.thumbnails.default.url,
      publishedAt: video.snippet.publishedAt,
      description: video.snippet.description,
      channelTitle: video.snippet.channelTitle
    });
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

    addToQueue(video) {
      console.log(video);
    },
    addToSongs(video) {
      console.log(video);
      this.get('addSong').perform(video).then((song) => this.get('songs').addObject(song)).catch(() => {});
    }
  }
});
