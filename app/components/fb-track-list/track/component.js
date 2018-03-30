import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  isQueue: null,
  song: null,
  video: null,
  queue: null,
  songs: null,
  mySongs: null,
  updateVideo: () => {},
  addToList: () => {},
  removeSong: () => {}
});
