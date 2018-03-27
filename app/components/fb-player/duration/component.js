import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  time: 0,
  duration: 0,
  isVideoUnstarted: false,

  _time: computed('time', function() {
    return Math.floor(this.get('time'));
  }),
  _duration: computed('duration', function() {
    return Math.floor(this.get('duration'));
  }),

  formattedTime: computed('_time', function () {
    return formatTime(this.get('_time'));
  }),
  formattedDuration: computed('_duration', function () {
    return formatTime(this.get('_duration'));
  }),
});

function formatTime(seconds) {
  let h, m = 0, s;
  s = seconds % 60;
  if (seconds > 59) {
    m = Math.floor(seconds / 60) % 60;
  }
  if (seconds > 60 * 60 - 1) {
    h = Math.floor(seconds / (60 * 60)) % 60;
  }
  let H = Number.isInteger(h) ? pad(h) + ':' : '';
  let M = pad(m) + ':';
  let S = pad(s);

  return H + M + S;
}

function pad(num) {
  return num.toString().padStart(2, "0");
}
