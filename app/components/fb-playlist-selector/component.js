import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  horizontalPosition: 'left',
  verticalPosition: 'below',
  isAbsolute: false,
  playlist: null,
  playlists: null,
  result: null,
  addToList: () => {}
});
