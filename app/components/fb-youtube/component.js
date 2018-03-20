import Component from '@ember/component';

export default Component.extend({
  localClassNames: ['firebass-youtube-container'],
  player: null,
  state: {
    video: null,
    muted: false,
    start: 0,
    volume: 50,
    speed: 1,
    loop: false,
    time: 0,
    quality: 'small',
    duration: 0,

  },
  config: {
    autoplay: 0,
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
    start: this.state.start
  },
  willInsertElement() {
    this._super(...arguments);
  },
  didInsertElement() {
    this._super(...arguments);

    const player = new YT.Player(this.element.querySelector('.player'), {
      height: '0',
      width: '0',
      videoId: 'M7lc1UVf-VE',
      playerVars: this.config,
      events: {
        'onReady': this.onPlayerReady,
        'onStateChange': this.onPlayerStateChange
      }
    });
    this.set('player', player);
    this.refreshComponentPropertiesFromPlayer();
  },

  refreshComponentPropertiesFromPlayer() {
    const player = this.get('player');
    const oldProperties = this.getProperties();
    const newProperties = Object.assign(oldProperties, {

    });
    this.setProperties(newProperties);
  },

  onPlayerReady({ target }) {
    debugger;
    console.log(target);
  },
  onPlayerStateChange({ target }) {
    debugger;
    console.log(target);
  }
});
