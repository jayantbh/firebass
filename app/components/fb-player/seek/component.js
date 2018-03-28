import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  time: 0,
  duration: 0,
  isVideoUnstarted: false,
  seekToTime: () => {}
});
