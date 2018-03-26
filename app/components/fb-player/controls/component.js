import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  time: 0,
  duration: 0,
  isVideoUnstarted: true,
  isVideoPlaying: false,
  isVideoPaused: false,
  isVideoStopped: false,
  player: null,
  video: null,

  actions: {
    playerControl(action) {
      switch (action) {
        case "play": this.player.playVideo(); break;
        case "pause": this.player.pauseVideo(); break;
        case "stop": this.player.stopVideo(); break;
        default: console.warn('Unhandled action: ', action);
      }
    }
  }
});
