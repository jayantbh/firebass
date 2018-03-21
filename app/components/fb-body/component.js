import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  videoUrlOrId: 'https://www.youtube.com/watch?v=oWCrc3MwXPI',
  videoId: '',

  // store: service(),

  init() {
    this._super(...arguments);
    // var newPost = this.get('store').createRecord('post', {
    //   title: 'EmberFire is flaming hot!',
    //   body: 'You can store and sync data in realtime without a backend.'
    // });
    // newPost.save();
  },

  actions: {
    updateVideoId(event) {
      event.preventDefault();

      let videoUrlOrId = this.get('videoUrlOrId');
      let [, videoId] = videoUrlOrId.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i);
      this.set('videoId', videoId);
    }
  }
});
