App.Views.Sidebar.ArtistDetails = Ember.View.extend({
  templateName: 'player-artist-details',
  tagName: 'ul',
  classNames: ['artist'],
  bandBinding: 'App.Controllers.ControlPanel.band.details',
  bioInfoPane: null,
  liveInfoPane: null,
  slideshow: null,
  bandNewsFeed: null,
  showNewsPane: function()
  {
	if(this.bandNewsFeed == null)
	{		
		this.bandNewsFeed = App.Views.ControlPanel.BandNewsFeed.create();
		this.bandNewsFeed.appendTo('body')
		
		//this.bandNewsFeed.replaceIn("#news-container");
	}
	this.showPane('news');
	$("li.nav-news").toggleClass("active");
  },
  showPane:function (clickedPane) {
	  var panes = ['news', 'lyrics', 'live', 'bio'];
	  $.each(panes, function(index, paneClass) {
	    if(paneClass != clickedPane){
	      $("div.spindal.pane." + paneClass).removeClass("active");
	    }
	  });
	  $("div.spindal.pane." + clickedPane).toggleClass("active");
	 
  },
  startSlideshow: function() {
    preloadImage(App.Controllers.ControlPanel.photoList.get('content')[0].file.url)

    this.slideshow = App.Views.Player.Slideshow.create({
      photoListBinding: 'App.Controllers.ControlPanel.photoList',
      transTimeBinding: 'App.Controllers.ControlPanel.band.gallery.g_transition_time',
      transStyleBinding: 'App.Controllers.ControlPanel.band.gallery.g_transition_style'
    });

    this.slideshow.appendTo("body");
  },

  stopSlideshow: function() {
    if(this.slideshow) {
      this.slideshow.destroy();
    }
  },

  photosClicked: function() {
    console.log('show photos');
    var photosButton = this.$('#gallery-photos-button');
    photosButton.toggleClass('active');

    if(photosButton.hasClass('active')) {
      this.startSlideshow();
    } else {
      this.stopSlideshow();
    }
    this.$('#gallery-videos-button').removeClass('active');
  },

  videosClicked: function() {
    console.log('show Vidoes');

    var videosButton = this.$('#gallery-videos-button');
    videosButton.toggleClass('active');

    if(videosButton.hasClass('active')) {
      this.showArrows();
    } else {
      this.hideArrows();
    }

    $('#gallery-photos-button').removeClass('active');
    this.stopSlideshow();
  },

  showBioInfo: function() {
    if(this.bioInfoPane == null) {
      this.bioInfoPane = App.Views.ControlPanel.BandBioInfo.create();
      this.bioInfoPane.appendTo('body');
    } else {
      this.bioInfoPane.$().toggleClass('active');
    }
  },
  
  showLiveInfo: function() {
    
    if(this.liveInfoPane == null) {
      this.liveInfoPane = App.Views.ControlPanel.BandLiveInfo.create();
      this.liveInfoPane.appendTo('body');
    } else {
      this.liveInfoPane.$().toggleClass('active');
    }
  },
  
  subscribe_email: function()
  {
	  var email = $('#news_subscribe_email').val();
	  var url = '/api/news_feed/'+App.Controllers.ControlPanel.band.details._id+'/subscribe';
	  $.post(url,{email: email},function()
			  {
		  		alert('Thanks for subscribing our news letter.');
		  		App.Controllers.ControlPanel.band.details.set('news_email_disabled', true);
		  		
			  }
	  );
	  console.log(url);
  },

  didInsertElement: function() {
    var that = this;

    this.$('.accordion').accordion({
      active: false,
      collapsible: true
    });

    // this.$('.show-gallery-arrows').click(function() {
    //   $(this).toggleClass('active');

    //   if($(this).hasClass('active')){
    //     $('ul.gallery-arrows').addClass('active');
    //   }
    //   else {
    //     $('ul.gallery-arrows').removeClass('active');
    //   }
    // });

    // this.$('#gallery-photos-button').click(function() {
    //   if($(this).hasClass('active')) {
    //     that.startSlideshow();
    //   }
    //   else {
    //     that.stopSlideshow();
    //   }

    //   $('#gallery-videos-button').removeClass('active');
    // });

    // this.$('#gallery-videos-button').click(function() {
    //   $('#gallery-photos-button').removeClass('active');
    //   that.stopSlideshow();
    // });

    this.$("a.nav-gallery").click(function() {
      $("li.nav-gallery").toggleClass("active");
    });
    /*
    this.$("#nav-news").click(function() {
      $("li.nav-news").toggleClass("active");
    });
    */

    this.$('a.show.bio').click(function() {
      showArtistPane('bio');

    });

   // this.$('a.show.bio').click(function() {
     // showArtistPane('bio');
   // });


    this.$('#gallery-videos-button').click(function() {
      $('#gallery-photos-button').removeClass('active');
    });

 
    this.$('a.show.bio').click(function() {
      showArtistPane('bio');
    });

    /*
    this.$('a.show.news').click(function() {
    	showArtistPane('live');
    });
    */

    this.$('a.show.live').click(function() {
      showArtistPane('live');
    });
  }

});
