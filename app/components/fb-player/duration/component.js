import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  time: 0,
  duration: 0,

  _time: computed('time', function() {
    return Math.floor(this.get('time'));
  }),
  _duration: computed('duration', function() {
    return Math.floor(this.get('duration'));
  })
});
