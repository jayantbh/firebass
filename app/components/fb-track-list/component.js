import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  collapsible: true,

  /**
   * isExpanded:   publicly settable value
   * _isExpanded:  intended to be settable only through an action
   * __isExpanded: computed prop. if the action has not been triggered, use the publicly available value.
   */
  isExpanded: false,
  _isExpanded: null,
  __isExpanded: computed('isExpanded', '_isExpanded', function () {
    let { isExpanded, _isExpanded } = this.getProperties('isExpanded', '_isExpanded');
    return _isExpanded === null ? isExpanded : _isExpanded;
  }),

  playlist: null,
  playlists: null,
  mySongs: null,
  track: null,
  queue: null,
  isQueue: false,
  addToList: () => {},
  removeSong: () => {},
  onPlaylistItemSelected: () => {}
});
