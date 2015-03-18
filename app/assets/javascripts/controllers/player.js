App.Controllers.ControlPanel.newsFeed = Ember.ArrayController.create({
	content: [],
	selectedFeed : 'all',
	setup: function (action) {
		var list = this;
		list.selectedFeed = 'all';
		this.set('content',[]);
		var url = '/api/news_feed';
		if(action)
		{
			url = url+'?type='+action;
			list.selectedFeed = action;
		}
						   
		var screenHeight = $(window).height();
		screenHeight =screenHeight - 81 +"px";
		$('#news-container').css({'height': screenHeight});
		
		$.getJSON(url, function(data) {
			  
			  $('#loading-container').show();
			  $('#news-container').hide();
			  
		  	 if(data)
		  	 {
		  		 if(data.status == 'ok')
		  		 {
		  			$.each(data['news_feed'], function(index, obj) 
		  		    {
		  				
				        var feed = App.Models.NewsFeed.create(obj[0]);		        
				        feed.set('feed_type' , obj[1]);
				        list.pushObject(feed)
		  		    });
		  	
				    if(list.content.length == 0 )
				    	$('#noFeedError').show();
		  		 }
		  		 else
		  		 {
		  		
		  			$('#noFeedError').show();	
		  		 }	 
				 
		  	 }
		  	 else
	  		 {
		  		
	  			$('#noFeedError').show();	
	  		 }
		  	$('#news-container').show();
			$('#loading-container').hide();
		  	 
		  	 
		    });
		
		
	},
	
});

App.Controllers.ControlPanel.emailList = Ember.ArrayController.create({
	content: [],
	selectedList : '' ,
	setup: function () {
		 var content_list = this;
		 this.set('content',[]);
		 var url = '/api/news_feed/email_list';
		
		 $.getJSON(url, function(data) { 
		   	 if(data)
		   	 {
		  		 
		  		 if(data.status == 'ok')
		  		 {
			   		 var email_list = data.email_list;
			   		 for(i = 0 ; i < email_list.length ; i++) {
				        
			 	         var email = App.Models.EmailList.create(email_list[i]);
			   			//var email = Ember.Object.create({web_id: email_list[i].web_id , name: email_list[i].name}); 
			 	        console.log(email);
			 	        content_list.pushObject(email);
				        
				        
			 	      }
		  		 }
				 
		   	 }
		  
		     });	
	}
	
});

App.Mixins.Sortable = Ember.Mixin.create({

  sortContent: function() {
    var sortedContent = this.get("content").sort( function(a,b){
      return a.get("order") - b.get("order");
    });

    this.set("content", []);
    this.set("content", sortedContent);
  }
});

App.Controllers.ControlPanel.albumList = Ember.ArrayController.create({
  content: [],

  populateSlideshow: function(song) {
    var slideshow = Ember.ArrayController.create(App.Mixins.Sortable,{content: []});

    $.each(song.photos, function(index, obj) {
      var photo = App.Models.Photo.create(obj);
      slideshow.content.addObject(photo);
    });

    slideshow.sortContent();
    var numPhoto = slideshow.content.length;

    if(numPhoto < 15) {
      var order = numPhoto+1;

      for(i=15; i>numPhoto; i--) {
        slideshow.pushObject(App.Models.Photo.create({
            song_id: song._id,
            order: order
          }));
        order += 1;
      }
    }
    return slideshow;
  },

  createSong: function(obj) {
    var that = this;
    var song = App.Models.Song.create(obj);
    
    song.slideshow = this.populateSlideshow(song);
    
    return song;
  },

  createAlbum: function(obj) {
    var that = this;

    var album = App.Models.Album.create(obj)
    album.songList = Ember.ArrayController.create({content: []});

    $.each(album.songs, function(index, obj) {
      var song = that.createSong(obj);
      album.songList.content.addObject(song);
    });
    return album;
  },

  setup: function(json) {
    var that = this;
    var albums = this.content;

    $.each(json, function(index, obj) {
      var album = that.createAlbum(obj);
      albums.addObject(album);
    });
  }
});

App.Controllers.ControlPanel.band = Ember.Object.create({
  //TODO: See how App.Models.Band can be used
  details: App.Models.Band.create(),
  gallery: App.Models.Gallery.create(),
  logo: App.Models.Logo.create(),
  setup: function(json) {
    details = this.details;
    gallery = this.gallery;

    if(json) {
      $.each(json, function(key, val) {
        details.set(key, val);
      });
      this.setupGallery(json);
      this.setupLogo(json["logo"]);
    }

    // Workarounds to bind SelectBox selected value
    details.reopen({
      genreChanged: function() {
        console.log("changed Genre is:" + this.selected_genre);
        if(this.selected_genre){
          this.set('genre_id', this.selected_genre._id);
        } else {
          this.set('genre_id', null);
        }
      }.observes('selected_genre'),
      subGenreChanged: function() {
        if(this.selected_sub_genre){
          this.set('sub_genre_id', this.selected_sub_genre._id);
        } else {
          this.set('sub_genre_id', null);
        }
      }.observes('selected_sub_genre'),

      currencyChanged: function() {
        console.log(this.selected_currency)
        if(this.selected_currency)
          this.set('paypal_currency', this.selected_currency.value);
        else
          this.set('paypal_currency', null);
      }.observes('selected_currency'),


      blogPlatformChanged: function() {
        if(this.selected_blog_platform)
          this.set('blog_platform_id', this.selected_blog_platform._id);
        else
          this.set('blog_platform_id', null);
      }.observes('selected_blog_platform'),

      emailProviderChanged: function() {
        if(this.selected_email_provider)
          this.set('email_provider_id', this.selected_email_provider._id);
        else
          this.set('email_provider_id', null);
      }.observes('selected_email_provider'),

      emailListChanged: function() {
        if(this.selected_email_list)
          this.set('email_list', this.selected_email_list.value);
        else
          this.set('email_list', null);
      }.observes('selected_email_list'),

      nameChanged: function() {
        this.set('spindle_url', "spindal.com/" + this.get('name'));
      }.observes('name')
    });
  },

  setupGallery: function(json) {
    gallery = this.gallery;

    $.each(App.Models.galleryAttrs, function(index, val) {
      gallery.set(val, json[val]);
    });
  },
  
  setupLogo: function(json) {
    var that = this;

    if(json) {
      $.each(App.Models.logoAttrs, function(index, val) {
        that.logo.set(val, json[val]);
      });
    }

    this.logo.set('band_id', this.details._id);

    this.logo.reopen({
      logoFontChanged: function() {
        if(this.selected_font)
          this.set('font_name', this.selected_font.value);
        else
          this.set('font_name', null);
      }.observes('selected_font'),
      
      logoAlignmentChanged: function() {
        if(this.selected_alignment)
          this.set('alignment', this.selected_alignment.value);
        else
          this.set('alignment', null);	  	
      }.observes('selected_alignment'),
    });

  }
});

App.Controllers.ControlPanel.photoList = Ember.ArrayController.create(App.Mixins.Sortable, {
  content: [],

  setup: function(json) {
    var order = 1;
    var list = this;

    if(json) {
      $.each(json, function(index, obj) {
        list.pushObject(App.Models.Photo.create(obj));
        order += 1;
      });
    }

    this.sortContent();

    var numPhoto = this.get('content').length;
    if(numPhoto < 15) {
      for(i=15; i>numPhoto; i--) {
        this.pushObject(App.Models.Photo.create({
          band_id: App.Controllers.ControlPanel.band.details._id,
          order: order
        }));
        order += 1;
      }
    }
  }
});
