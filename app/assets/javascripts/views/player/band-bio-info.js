App.Views.ControlPanel.BandBioInfo = Ember.View.extend({
  templateName: 'player-band-bio-info',
  bandBinding: 'App.Controllers.ControlPanel.band.details',
  classNames: ['spindal','pane','bio'],
  didInsertElement: function () {
    //this.$().toggleClass("active");
    var that = this;
    setTimeout(function() {
      that.togglePane()},
      3);
  },
  togglePane: function() {
  	this.$().toggleClass("active");
  }
 });
