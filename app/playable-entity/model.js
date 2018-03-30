import DS from 'ember-data';

export default DS.Model.extend({
  videoId: DS.attr('string'),
  kind: DS.attr('string'),
  title: DS.attr('string'),
  thumbnail: DS.attr('string'),
  publishedAt: DS.attr('date'),
  addedAt: DS.attr('date'),
  description: DS.attr('string'),
  channelTitle: DS.attr('string'),
  playlists: DS.hasMany('playlist', { inverse: 'entities' })
});
