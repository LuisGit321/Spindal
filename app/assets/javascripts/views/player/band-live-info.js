App.Views.ControlPanel.BandLiveInfo = Ember.View.extend({
  templateName: 'player-band-live-info',
  liveShowList: 'App.Controllers.ControlPanel.liveShowList',
  classNames: ['spindal','pane','live'],
  didInsertElement: function () {
   //this.$().toggleClass("active");
    var that = this;
    setTimeout(function() {
      that.toggleLivePane()},
      3);
  },
  toggleLivePane: function() {
  	this.$().toggleClass("active");
  }
 });
