App.Views.Player.BandLogo = Ember.View.extend({
  templateName: "player-band-logo",
  logoBinding: "App.Controllers.ControlPanel.band.logo",
  bandBinding: "App.Controllers.ControlPanel.band.details",

  imageEmpty: true,
  fileChanged: function() {
    if(this.logo.file && this.logo.file.url) {
      this.set('imageEmpty', false);
    } else {
      this.set('imageEmpty', true);
    }
  }.observes('logo.file'),

  textLogoShown: function() {
    if(this.band.logo_disabled)
      this.$().hide();
    else{
      this.$().show();
      this.applyLogoSettings();      
    }
  }.observes('band.logo_disabled'),

  didInsertElement: function() {
    this.applyLogoSettings();
    this.textLogoShown();
  },

  bandHomeURL: function() {
    return '/' + this.band.name;
  }.property('band.name'),

  bandLogoName: function() {
    if(this.logo.band_logo_name){
      return this.get('logo').band_logo_name;
    }
    else{
      console.log("returning band name");
      return " "; //Workaround, Ember does not render elements with empty content
    }
  }.property('band.name', 'logo.band_logo_name'),

  applyLogoSettings: function() {
    this.applyFontFamily();
    this.applyFontColor();
    this.applyFontSize();
    this.applyTextAlignment();
  },

  fontColorChanged: function() {
    this.applyFontColor();
  }.observes('logo.font_color'),

  fontFamilyChanged: function() {
    this.applyFontFamily();
  }.observes('logo.font_name'),

  fontSizeChanged: function() {
    this.applyFontSize();
  }.observes('logo.font_size'), 

  textAlignmentChanged: function() {
    this.applyTextAlignment();
  }.observes('logo.alignment'),

  applyFontColor: function() {
  	if(this.$("#band_text"))
	  	this.$("#band_text").css({'color':this.get('logo').get('font_color')});
  },

  applyFontFamily: function() {
  	if(this.$("#band_text"))
	  	this.$("#band_text").css({'font-family':this.get('logo').font_name});
  },

  applyFontSize: function() {
  	var fontSize = this.logo.get('font_size');

  	if(fontSize > 200)
  		fontSize = 200;

  	if(this.$("#band_text"))
	  	this.$("#band_text").css({'font-size':fontSize+'px'});
  },

  applyTextAlignment: function() {
		this.$().css({'text-align':this.get('logo').alignment});
  }
});
