App.Views.ControlPanel.Light = Ember.View.extend({
  tagName: "div",
  classNames: ["light"],
  click: function () {
    this.set('disabled', !this.get('disabled'));
    this.$().parents('li.row').toggleClass('disabled');
  }
});
