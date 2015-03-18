App.Views.ControlPanel.SpindalSelect = Ember.Select.extend({
  selectedItem: null,

  didInsertElement: function() {
    this.initializeSelect();
  },
  contentChanged: function() {
    var that = this;

    setTimeout(function(){
      that.$().selectBox('destroy');
      that.initializeSelect();
    }, 0);
  }.observes('content'),

  // selectionChanged: function() {
  //   console.log('selection changed');
  //   // this.set('initVal', this.get('selectedItem'))
  // }.observes('selection'),

  initializeSelect: function() {
    var initialValue = this.get('initVal');

    if(initialValue){
      this.$().selectBox('value', initialValue);
    }
    else {
      this.$().selectBox('value', this.get('prompt'))
    }

    this.$().selectBox('create')
  }
});