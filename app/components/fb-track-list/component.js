import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  isExpanded: false,
  collapsible: true,

  songs: null,
  mySongs: null,
  video: null,
  queue: null,
  isQueue: false,
  addToList: () => {},
  removeSong: () => {},
  updateVideo: () => {}
});
