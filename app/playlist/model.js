import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  entities: DS.hasMany('playable-entity'),
  createdAt: DS.attr('string'),
  type: DS.attr('string'),  // queue | TODO: standard
  access: DS.attr('string'), // private | TODO: public | collaborative
  currentTrack: DS.belongsTo('playable-entity')
});
