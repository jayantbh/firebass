import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  horizontalPosition: 'left',
  verticalPosition: 'below',
  filterOutSelectedPlaylists: false,
  isAbsolute: false,
  playlist: null,
  playlists: null,
  result: null,
  addToList: () => {},

  filteredPlaylists: computed('playlists', 'playlist', function () {
    if (this.get('filterOutSelectedPlaylists') && this.get('playlist')) {
      this.get('playlists').rejectBy('id', this.get('playlist.id'));
    }
    return this.get('playlists');
  })
});
