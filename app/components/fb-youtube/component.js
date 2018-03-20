import Component from '@ember/component';

export default Component.extend({
  localClassName: 'firebass-youtube-container',
  player: null,

  // State Properties
  autoplay: 1,
  video: null,
  muted: false,
  start: 0,
  volume: 50,
  speed: 1,
  loop: false,
  time: 0,
  quality: 'small',
  duration: 0,

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.video && this.player) {
      this.player.loadVideoById(this.video);
      this.refreshComponentPropertiesFromPlayer(); }
  },

  didInsertElement() {
    this._super(...arguments);
    this.initializeYoutubePlayer();
  },

  initializeYoutubePlayer() {
    const config  = {
      autoplay: this.autoplay || 0,
      cc_load_policy: 0,
      controls: 0,
      disablekb:1,
      enablejsapi: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      origin: window.location.host,
      playsinline: 1,
      rel: 0,
      showinfo: 0,
      start: this.start || 0
    };
    const player = new YT.Player(this.element.querySelector('.player'), {
      height: '0',
      width: '0',
      videoId: this.video,
      playerVars: config,
      events: {
        'onReady': this.onPlayerReady,
        'onStateChange': this.onPlayerStateChange
      }
    });
    this.set('player', player);
  },

  refreshComponentPropertiesFromPlayer() {
    const player = this.get('player');
    const oldProperties = this.getProperties();
    const newProperties = Object.assign(oldProperties, {

    });
    this.setProperties(newProperties);
  },

  onPlayerReady({ target }) {
    console.log(target);
  },
  onPlayerStateChange({ target }) {
    console.log(target);
  }
});
