import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  newPlaylistName: '',
  compactForm: false,
  horizontalPosition: 'center',
  verticalPosition: 'below',
  onCreatePlaylist: () => {},

  store: service(),

  addNewPlaylist: task(function * (dropdown) {
    let playlist = yield this.get('store').createRecord('playlist', {
      name: this.get('newPlaylistName'),
      createdAt: new Date(),
      type: 'generic',
      access: 'private'
    });
    yield playlist.save();

    this.onCreatePlaylist(playlist);

    if (dropdown) { dropdown.actions.close(); }
    this.set('newPlaylistName', '');
    return playlist;
  }).drop()
});
