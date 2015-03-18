App.Views.Player.Slideshow = Ember.View.extend({
  arrowsVisible: true

  willInsertElement: ->
    photoArray = this.photoUrls()

    unless photoArray.length == 0
      this.addSlider(photoArray)
      if this.arrowsVisible
        this.showArrows()

  willDestroyElement: ->
    window.views.player.background.setImage()
    this.hideArrows()
    this.removeSlider()

  transTimeChanged: Ember.observer(->
      console.log('transTime changed')
      if api?
        api.options.slide_interval = this.get('transTime') * 1000
    ,'transTime')

  transStyleChanged: Ember.observer(->
      console.log('transStyle changed')
      if api?
        api.options.transition = this.getTransitionStyle()
    ,'transStyle')

  # photosChanged: Ember.observer(->
  #     console.log('photos changed')
  #     if api?
  #       this.removeSlider()
  #       api.options.slides = this.photoUrls()
  #       this.addSlider()
  #   ,'photoList.content.@each')

  addSlider: (photoArray)->
    if($.supersized.vars)
      $('body').append("<div id='supersized-loader'></div><ul id='supersized'></ul>")

    transStyle = this.getTransitionStyle()
    console.log(this.transTime)

    $.supersized({
        
      # Functionality
      slide_interval  :   this.get('transTime') * 1000,  # Length between transitions
      transition      :   transStyle,         # 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
      transition_speed:   700,# Speed of transition
                                 
      # Components             
      slide_links     :   'blank',  # Individual links for each slide (Options: false, 'num', 'name', 'blank')
      slides          :   photoArray  
    })

    setTimeout(->
        window.views.player.background.clearImage()
      , 500)

  removeSlider: ->
    if($.supersized.vars.slideshow_interval)
      clearInterval($.supersized.vars.slideshow_interval)

    $("#supersized-loader").remove()
    $("#supersized").remove()

  showArrows: ->
    $('ul.gallery-arrows').addClass('active')

  hideArrows: ->
    $('ul.gallery-arrows').removeClass('active')

  photoUrls: ->
    list = []
    photos = this.photoList.get('content')
    list = ({"image":photo.file.url} for photo in photos when typeof(photo.file) != "undefined")

    return list

  getTransitionStyle: ->
    # 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
    style = this.get('transStyle')

    switch style
      when "normal"
        return 0
      when "slide"
        return 5
      when "fade"
        return 1
      else
        return 0

  activateBkSlider: (photoArray)->
    # switch this.transStyle
    #   when "normal"
    #     easeIn = easeOut = "";
    #     enter = exit = {left:0,opacity:100};
    #   when "slide"
    #     easeIn = easeOut = "swing";
    #     enter = {left:0,opacity:0};
    #     exit = {left:3000,opacity:100};
    #   when "fade"
    #     easeIn = 'ease-in';
    #     easeOut = 'ease-out';
    #     enter = exit = {left:0,opacity:0};

    # $.mbBgndGallery.buildGallery({
    #   containment:"body",
    #   controls: "#controls"
    #   timer: this.transTime * 1000,
    #   effTimer:3000,
    #   images: photoArray,
    #   activateKeyboard: false,
    #   effect: {enter:enter,exit:exit, enterTiming:easeIn, exitTiming:easeOut}
    # });
})