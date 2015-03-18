App.Views.ControlPanel.PopUp = Ember.View.extend({
  close: function() {
    var popUp = this.$().closest('.popup');
    this.$('select').selectBox('destroy');
    // TODO: Remove destroy, make visible same view again
    this.destroyElement();
    popUp.showPop();
  }
});
