import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  newPlaylistName: '',

  store: service(),

  addNewPlaylist: task(function * (dropdown) {
    let playlist = yield this.get('store').createRecord('playlist', {
      name: this.get('newPlaylistName'),
      createdAt: new Date().getTime(),
      type: 'generic',
      access: 'private'
    });
    yield playlist.save();

    if (dropdown) { dropdown.actions.close(); }
    this.set('newPlaylistName', '');
    return playlist;
  }).drop()
});
