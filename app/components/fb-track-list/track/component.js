import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  isQueue: null,
  song: null,
  track: null,
  queue: null,
  playlist: null,
  playlists: null,
  mySongs: null,
  addToList: () => {},
  removeSong: () => {},
  onTrackSelected: () => {},

  canAddToMySongsOrQueue: computed('isQueue', 'song', 'mySongs.entities.@each.videoId', 'queue.entities.@each.videoId', 'playlist.entities.@each.videoId', function () {
    let { isQueue, song, mySongs, queue, playlist } = this.getProperties('isQueue', 'song', 'mySongs', 'queue', 'playlist');
    let songIsInQueueButNotInMySongs, songIsNotInQueueAndThisPlaylistIsNotTheQueue;

    let thisPlaylistIsTheQueueAndHasAccessToMySongsOrOtherwise = isQueue === Boolean(mySongs);
    queue = isQueue ? playlist : queue;

    if (!(song && queue && thisPlaylistIsTheQueueAndHasAccessToMySongsOrOtherwise)) return false;

    let queueEntities = queue.get('entities');
    let songVideoId = song.get('videoId');

    let songInQueue = queueEntities.findBy('videoId', songVideoId);

    songIsNotInQueueAndThisPlaylistIsNotTheQueue = !isQueue && !songInQueue;

    if (mySongs) {
      let mySongsEntities = mySongs.get('entities');
      let songInMySongs = mySongsEntities.findBy('videoId', songVideoId);
      songIsInQueueButNotInMySongs = isQueue && !songInMySongs;
    }

    return songIsInQueueButNotInMySongs || songIsNotInQueueAndThisPlaylistIsNotTheQueue;
  })
});
