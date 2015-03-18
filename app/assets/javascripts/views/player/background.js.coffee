App.Views.Background = Ember.View.extend({
  bandBinding: 'App.Controllers.ControlPanel.band.details'

  didInsertElement: ->

  backgroundImageChanged: Ember.observer(->
      console.log('Background Image changed')
      this.setImage()
    ,'band.bg_image')

  setImage: ->
    if(this.get('band').bg_image.url)
      $('body').addClass('background')
      $('#bg img').attr('src',  this.get('band').bg_image.url)
      $('#bg img').show()

  clearImage: ->
    $('#bg img').attr('src', '')
    $('#bg img').hide()
})