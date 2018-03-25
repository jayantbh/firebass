import Component from '@ember/component';
import { computed } from '@ember/object';

const PLAYER_UPDATE_INTERVAL = 500;
const YTStatus = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  VIDEO_CUED: 5
};

export default Component.extend({
  player: null,
  updaterTimeoutId: null,

  // State Properties
  autoplay: 1,
  video: null,
  muted: false,
  start: 0,
  buffered: 0,
  volume: 50,
  speed: 1,
  loop: false,
  time: 0,
  quality: 'small',
  duration: 0,
  author: null,
  title: null,
  playerState: -1,

  // CPs
  isVideoUnstarted: computed('playerState', function() { return this.get('playerState') === YTStatus.UNSTARTED }),
  isVideoPlaying: computed('playerState', function() { return this.get('playerState') === YTStatus.PLAYING }),
  isVideoPaused: computed('playerState', function() { return this.get('playerState') === YTStatus.PAUSED }),
  isVideoStopped: computed('playerState', function() { return this.get('playerState') === YTStatus.ENDED }),

  // Hooks
  didReceiveAttrs() {
    this._super(...arguments);
    if (this.video && this.player) {
      this.stopRefreshingComponentPropertiesFromPlayer();

      this.player.loadVideoById(this.video.get('videoId'));
      this.refreshComponentPropertiesFromPlayer();
    }
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
        'onReady': (...args) => { this.onPlayerReady.call(this, ...args) },
        'onStateChange': (...args) => { this.onPlayerStateChange.call(this, ...args) }
      }
    });
    this.set('player', player);
  },

  refreshComponentPropertiesFromPlayer() {
    const player = this.player;
    const newProperties = {
      buffered: player.getVideoLoadedFraction(),
      time: player.getCurrentTime()
    };
    this.setProperties(newProperties);
    console.log(newProperties);

    const timeout = setTimeout(() => this.refreshComponentPropertiesFromPlayer(), PLAYER_UPDATE_INTERVAL);
    this.set('updaterTimeoutId', timeout);
  },

  stopRefreshingComponentPropertiesFromPlayer() {
    if (this.updaterTimeoutId) { clearTimeout(this.updaterTimeoutId); }
    this.set('updaterTimeoutId', null);
  },

  setMinimumAvailablePlaybackQuality() {
    const lowestQuality = this.player.getAvailableQualityLevels().filter((q) => q !== 'auto').get('lastObject');
    const currentQuality = this.player.getPlaybackQuality();

    if (lowestQuality === currentQuality) return;
    this.player.setPlaybackQuality(lowestQuality);
  },

  // YoutubeAPI Event Hooks
  onPlayerReady() {
    // console.log('READY');
  },
  onPlayerStateChange() {
    const player = this.player;

    const oldProperties = this.getProperties('duration', 'time');
    const { author, title } = player.getVideoData();
    const newProperties = {
      duration: player.getDuration(),
      playerState: player.getPlayerState(),
      author, title
    };
    this.setProperties(newProperties);
    console.log(newProperties);

    this.stopRefreshingComponentPropertiesFromPlayer();

    const videoIsPlayingButWasNot = this.playerState === YTStatus.PLAYING && oldProperties.playerState !== YTStatus.PLAYING;

    if (videoIsPlayingButWasNot) {
      this.setMinimumAvailablePlaybackQuality();
      this.refreshComponentPropertiesFromPlayer();
    }
  },

  actions: {
    seekToTime(e) {
      console.log(e.target.value);
      this.player.seekTo(e.target.value);
    }
  }
});
