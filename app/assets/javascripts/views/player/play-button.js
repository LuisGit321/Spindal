App.Views.PlayButton = Ember.View.extend({
  tagName: 'a',
  classNames: ['play', 'big'],
  classNameBindings: ['isHidden:invisible'],
  bandBinding: 'App.Controllers.ControlPanel.band.details',
  startPlaying: false,

  didInsertElement: function() {
  },
  isHidden: function() {
  	return this.band.get('play_button_disabled');
  }.property('band.play_button_disabled'),
  click: function() {
  	console.log("Big Play clicked");
  	this.set('startPlaying', !this.get('startPlaying'));
    this.destroy();
  }
});