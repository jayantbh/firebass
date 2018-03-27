import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  songs: null,
  mySongs: null,
  video: null,
  queue: null,
  isQueue: false,
  addToList: () => {},
  removeSong: () => {},
  updateVideo: () => {}
});
