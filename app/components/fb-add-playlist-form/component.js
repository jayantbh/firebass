import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  newPlaylistName: '',

  store: service(),

  addNewPlaylist: task(function * () {
    let playlist = yield this.get('store').createRecord('playlist', {
      name: this.get('newPlaylistName'),
      createdAt: new Date().getTime(),
      type: 'generic',
      access: 'private'
    });
    return yield playlist.save();
  }).drop()
});
