App.Views.Sidebar.Lyrics = Ember.View.extend({
  templateName: 'player-lyrics',
  classNames: ['spindal','pane','lyrics'],
  songBinding: null,

  didInsertElement: function () {
  },

  togglePane: function() {
  	this.$().toggleClass("active");
  }
 });
