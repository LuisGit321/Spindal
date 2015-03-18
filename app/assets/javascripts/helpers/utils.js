Ember.HandlebarsTransformView = Ember.View.extend(Ember.Metamorph, {
  rawValue: null,
  transformFunc: null,

  value: function(){
    var rawValue = this.get('rawValue'),
        transformFunc = this.get('transformFunc');
    return transformFunc(rawValue);
  }.property('rawValue', 'transformFunc').cacheable(),

  render: function(buffer) {
    var value = this.get('value');
    if (value) { buffer.push(value); }
  },

  needsRerender: function() {
    this.rerender();
  }.observes('value')
});

Ember.HandlebarsTransformView.helper = function(context, property, transformFunc, options) {
  options.hash = {
    rawValueBinding: property,
    transformFunc: transformFunc
  };
  return Ember.Handlebars.ViewHelper.helper(context, Ember.HandlebarsTransformView, options);
};

Ember.Handlebars.registerHelper('datetime', function(property, options) {
  var format = options.hash.format,
      transformFunc = function(value) {
      var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
      
      var dateSplit = value.split('-');
      var date;

      if(value && dateSplit.length == 3)
        date = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2]);
      else
        date = new Date();

      var result = monthNames[date.getMonth()]  + " " + date.getDate() + ", " + date.getFullYear(); 
        return result;
      };

   return Ember.HandlebarsTransformView.helper(this, property, transformFunc, options);
});

Ember.Handlebars.registerHelper('format_bio', function(property, options) {	
  var format = options.hash.format,
      transformFunc = function(value) {
      var result = value.replace(/\n\r?/g, '<br />');
        return result;
      };
   return Ember.HandlebarsTransformView.helper(this, property, transformFunc, options);
});

