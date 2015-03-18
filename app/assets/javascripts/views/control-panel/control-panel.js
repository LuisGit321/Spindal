/*********** Profile Tab *************/
App.LogoColorPickerView = Ember.View.extend({

  click: function(evt) {
	 var that = this;
    $('#font_color').ColorPicker({
    	color: '#0000ff',
    	onShow: function (colpkr) {
    		 
    		$(".colorpicker").css('z-index',10000);
  	    $(".colorpicker").css('left','39%');
    		$(colpkr).fadeIn(500);
    		return false;
    	},
    	onHide: function (colpkr) {
    	
    		$(colpkr).fadeOut(500);
    		return false;
    	},
    	onChange: function (hsb, hex, rgb) {
        that.set('fontColor', '#' + hex);
    		that.$("div.color-preview").css('background-color', '#' + hex);
    	}
  	});
	
  	$('#font_color').click();
  }
});

App.Views.ControlPanel.Band = Ember.View.extend(App.Mixins.AutoSave, {
  templateName: "control-panel-profile",
  tagName: "form",
  band: App.Controllers.ControlPanel.band.details,
  logo: App.Controllers.ControlPanel.band.logo,
  bg_empty: true,
  
  attrChanged: function() {
    this.delayedAutoSave();
  }.observes('delayedSaveAttributes'),

  delayedSaveAttributes: Ember.computed(function() {
  }).property('band.city', 'band.state', 'band.country'),

  didInsertElement: function () {
    // TODO: make this a event handler
    $('#events td.status a.delete').click(function() {
      $('.popup.delete-event').showPop();
    });
    this.initializeAutoSaveFor(this.band);
  },

  selectBackground: function() {
    this.$("input:file.background-file").trigger('click');
  },

  uploadBackground: function() {
    var that = this;
    var uploadForm = this.$("input:file.background-file", "form");
    var csrfToken = $('meta[name=csrf-token]').prop('content');
    this.band.uploadBackground(uploadForm, csrfToken);
  },
  
  //TODO: For all popups, no need to create view every time, create once
  //TODO: Container View for containing all popup Views? Remove popup containers from Application.html  
  showStore: function(event) {
    $('#store-pop').showPop();
    var view = App.Views.ControlPanel.BandStore.create();
    view.replaceIn("#store-pop");
  },

  showBio: function(event) {
    $('#bio-pop').showPop();
    var view = App.Views.ControlPanel.BandBio.create();
    view.replaceIn("#bio-pop");
  },
  showFB: function(event) {
    $('#fb-pop').showPop();
    var view = App.Views.ControlPanel.BandFB.create();
    view.replaceIn("#fb-pop");
  },
  showTwitter: function(event) {
    $('#twitter-pop').showPop();
    var view = App.Views.ControlPanel.BandTwitter.create();
    view.replaceIn("#twitter-pop");
  },
  showLiveShows: function(event) {
    $('#live-show-pop').showPop();
    var view = App.Views.ControlPanel.BandShows.create();
    view.replaceIn("#live-show-pop");
  },
  showNews: function(event) {
    $('#news-pop').showPop();
    var view = App.Views.ControlPanel.BandNews.create();
    view.replaceIn("#news-pop");
  },
  
  showLogo: function(event) {
    $('#band-logo-pop').showPop();
    var view = App.Views.ControlPanel.BandLogoSettings.create();
    view.replaceIn("#band-logo-pop");
  },
   
  selectLogo: function()  {
    this.$('input:file.logo-file').click();
  },

  uploadLogo: function() {
    var that = this;
    var url = '/api/logos/upload';
    
    var csrfToken = $('meta[name=csrf-token]').prop('content');
    $.ajax(url, {
        files   : that.$("input.logo-file", "form"),
        iframe  : true,
        async   : false,
        headers : { 'X-CSRF-Token' : csrfToken },
        // Success is being skipped by jquery-iframe-transport plugin,
        // So the hack in the error() callback.
        success : function (data, textStatus, jqXHR) {
          alert("Your file was successfully uploaded");
          var logo = $.parseJSON(jqXHR.responseText);
          that.get('logo').set('file', logo.file);
          return true;
        },
        error : function (jqXHR, textStatus, errorThrown) {
          var responseText = jqXHR.responseText;
          
          if (undefined != responseText && responseText.match(/^\{.*\}$/)) {
            var logo = $.parseJSON(jqXHR.responseText);
            that.get('logo').set('file', logo.file);
            return true;
          } else {
            alert("Error: The file you tried to upload did not work. Please try again.");
            return false;
          }
        }
    });
  }
});

App.Views.ControlPanel.BandLogoSettings = App.Views.ControlPanel.PopUp.extend(App.Mixins.AutoSave, {
  templateName: "control-panel-profile-logo-settings",
  logoBinding: "App.Controllers.ControlPanel.band.logo",
  bandNameBinding: "App.Controllers.ControlPanel.band.details.name",
   
  didInsertElement: function() {
    this.removeLogoFile();
    window.views.player.logo.rerender();
    this.initializeAutoSaveFor(this.logo);
  },

  removeLogoFile: function() {
    this.logo.set('remove_file', true);
    this.logo.saveResource();
    this.logo.set('file', null);
  },

  fontSizeChanged: function() {
    console.log("font-size changed");
    this.logo.set('font_size', $("input.logo-font-size").val());
  },

  save: function() {
    this.logo.saveResource();
    this.close();
  }
});

App.Views.ControlPanel.BandShows = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-profile-live-show-list",
  liveShowList: App.Controllers.ControlPanel.liveShowList,
  scrollbar: null,
  didInsertElement: function() {
    this.scrollbar = this.$('#events').jScrollPane();
  },
  reinitializeScrollbar: function() {
    this.scrollbar.data('jsp').reinitialise();
  },

  createLiveShow: function() {
    var that = this;
    //Adding new Model object should be moved to controller
    var newShow = App.Models.LiveShow.create({
      day: new Date().toString("yyyy-mm-dd"),
      band_id: App.Controllers.ControlPanel.band.details._id,
      city: "",
      state: "",
      ticket_url: ""
    });
    this.liveShowList.pushObject(newShow);
    // this.$('#events').jScrollPane();
  }
});

App.Views.ControlPanel.LiveShow = Ember.View.extend(App.Mixins.AutoSave, {
  templateName: 'control-panel-profile-live-show-item',
  tagName: "tr",
  didInsertElement: function () {
    this.initializeDatePicker();
    this.initializeAutoSaveFor(this.liveShow);

    if(this.liveShow.isNew()){
      this.get('parentView').reinitializeScrollbar();
      this.$('td.venue input').focus();
    }
  },
  initializeDatePicker: function() {
    var that = this;
    // TODO: Refactor Datepicker functions
    var dayPicker = this.$('input.datepicker');
    dayPicker.datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: function(dateText, inst) {
        that.liveShow.set('day', dateText);
        that.liveShow.saveResource(['day']);
      }
    });

    dayPicker.datepicker(
      'setDate', new Date(this.liveShow.day)
      );
  },
  erase: function() {
    if(!this.liveShow.isNew()){
      this.liveShow.destroyResource();
    } 
    App.Controllers.ControlPanel.liveShowList.removeObject(this.liveShow);
    this.destroy();
  }
});

App.Views.ControlPanel.BandNews = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-profile-news",
  newsBinding: "App.Controllers.ControlPanel.band.details",
  didInsertElement: function() {
    
    $('#blog_url_id').change(function(){
    	console.log('blog value change');
    	App.Controllers.ControlPanel.band.details.saveResource(['blog_url']);
    	if(App.Controllers.ControlPanel.newsFeed.selectedFeed == 'blog' || App.Controllers.ControlPanel.newsFeed.selectedFeed == 'all')
    	{
	    	$('#loading-container').show();
			$('#news-container').hide();
			App.Controllers.ControlPanel.newsFeed.setup(App.Controllers.ControlPanel.newsFeed.selectedFeed);
    	}	
      });
    
    $('#fb_handle_id').change(function(){
        console.log('facebook value change');
        App.Controllers.ControlPanel.band.details.saveResource(['fb_handle']);
        if(App.Controllers.ControlPanel.newsFeed.selectedFeed == 'facebook'  || App.Controllers.ControlPanel.newsFeed.selectedFeed == 'all')
        {
	        $('#loading-container').show();
			$('#news-container').hide();
			App.Controllers.ControlPanel.newsFeed.setup(App.Controllers.ControlPanel.newsFeed.selectedFeed);
        }	
      });
    $('#instagram_handle_id').change(function(){
    	console.log('instagram value change');
    	App.Controllers.ControlPanel.band.details.saveResource(['instagram_handle']);
    	if(App.Controllers.ControlPanel.newsFeed.selectedFeed == 'instagram'  || App.Controllers.ControlPanel.newsFeed.selectedFeed == 'all')
        {
	        $('#loading-container').show();
			$('#news-container').hide();
			App.Controllers.ControlPanel.newsFeed.setup(App.Controllers.ControlPanel.newsFeed.selectedFeed);
        }
    });
    $('#twitter_handle_id').change(function(){
        console.log('twitter value change');
        App.Controllers.ControlPanel.band.details.saveResource(['twitter_handle']);
        if(App.Controllers.ControlPanel.newsFeed.selectedFeed == 'twitter'  || App.Controllers.ControlPanel.newsFeed.selectedFeed == 'all')
        {
	        $('#loading-container').show();
			$('#news-container').hide();		
			App.Controllers.ControlPanel.newsFeed.setup(App.Controllers.ControlPanel.newsFeed.selectedFeed);
        }
      });
    $('#email_provider_id').change(function (){
    	console.log('Selecting the email provider');
    	console.log(this.value);
    	
    	if(this.options[this.selectedIndex].text == 'Constant Contact')
    	{
    		
    		$('#news-email-pop').showPop();
		    var view = App.Views.ControlPanel.NewsEmail.create();
		    view.replaceIn("#news-email-pop");
    	}
    	
    	App.Controllers.ControlPanel.band.details.email_provider_id = this.value;
    	App.Controllers.ControlPanel.band.details.saveResource(['email_provider_id']);
    });
    $('#email_key_id').change(function(){
    	console.log('validating email key');
    	App.Controllers.ControlPanel.band.details.saveResource(['email_api_key']);
    	var url = '/api/news_feed/'+App.Controllers.ControlPanel.band.details._id+'/validate_email_key';
    	
    	$('#verifedKey').hide();
    	$('#loading').show();
    	
    	
   	    $.get(url,function(data)
   			  {
   	    
   	    		console.log(data);
   	    		if(data.status == 'ok')
   	    		{
   	    			$('#loading').hide();
   	    			$('#verifedKey').show();
   	    			var list = data.email_list;
   	    			
   	    			/*
   	    			App.Controllers.ControlPanel.emailList.contentWillChange();
   	    			for(i = 0 ; i < list.length ; i++)
   	    			{
   	    				var email_list = App.Models.EmailList.create(list[i]);
   	    				App.Controllers.ControlPanel.emailList.pushObject( email_list);
   	    				console.log(email_list);
   	    			}
   	    			App.Controllers.ControlPanel.emailList.propertyDidChange();
   	    			*/
   	    		}
   	    		App.Controllers.ControlPanel.emailList.setup();
   	    		// refresh the view
   	    		
   	    		
   			  }
   	    );
    	
    });	
    $('#blog_plateform_id').change(function (){
    	console.log('Selecting the blog plateform');
    	console.log(this.value);
    	App.Controllers.ControlPanel.band.details.saveResource(['blog_platform_id']);
    });
    
    $('#email_list_id').change(function (){
    	console.log('Selecting the email list');
    	console.log(this.value);
    	//debugger;
    	App.Controllers.ControlPanel.band.details.set('email_list', this.value)
    	App.Controllers.ControlPanel.band.details.saveResource(['email_list']);
    });
    
    
  },

  save: function() {
	console.log('saving the news feed variable');
	console.log(App.Models.newsAttrs);
	this.news.saveResource(App.Models.newsAttrs);    
    this.close();
  }
});

App.Views.ControlPanel.NewsEmail = App.Views.ControlPanel.PopUp.extend({
	  templateName: "control-panel-profile-news-email",
	  newsBinding: "App.Controllers.ControlPanel.band.details",
	  bg_empty: true,
	  save: function() {
			console.log('saving the constanct contact credentials');
			this.news.saveResource(['email_api_username' , 'email_api_password']);    
		    this.close();
		  }
});

App.Views.ControlPanel.BandBio = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-profile-bio",
  bandBinding: "App.Controllers.ControlPanel.band.details",
  didInsertElement: function() {
    this.$('.textarea-scroll').jScrollPane();
  },

  save: function() {
    this.band.saveResource(['bio']);
    this.close();
  }
});

App.Views.ControlPanel.BandFB = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-profile-fb",
  bandBinding: "App.Controllers.ControlPanel.band.details",
  validable: null,

  didInsertElement: function() {
    this.set('validable' , this.$('input.validate').validate({
        errorMsg: "Invalid link. Please try again.",
        defaultPlaceholder: "http://www.facebook.com/yourpage",
        regex: /((https|http):\/\/)?((w{3}\.)?)facebook.com\/(?:[^\s()\\\[\]{};:'",<>?]){1,}/
      })
    );
  },

  save: function() {

    if(this.band.fb_url) {
      if(this.band.fb_url.indexOf("http") == -1)
        this.band.set('fb_url', "http://" + this.band.fb_url);

      if(this.validable.validate("check")) {
        this.band.set('fb_disabled', false)
        this.band.saveResource(['fb_url', 'fb_disabled']);
        this.close();
      } else {
        this.band.set('fb_disabled', true)
        this.band.set('fb_url', '');
      }
    } else {
      this.band.saveResource(['fb_url']);
      this.close();
    }
  }
});

App.Views.ControlPanel.BandTwitter = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-profile-twitter",
  bandBinding: "App.Controllers.ControlPanel.band.details",
  validable: null,

  didInsertElement: function() {
    this.set('validable' , this.$('input.validate').validate({
        errorMsg: "Invalid link. Please try again.",
        defaultPlaceholder: "http://www.twitter.com/#!/yourpage",
        regex: /((https|http):\/\/)?((w{3}\.)?)twitter.com?[\/\.](?:[^\s()\\\[\]{};:'",<>?]){1,}/
      })
    );
  },

  save: function(){

    console.log("url is" + this.band.fb_url)

    if(this.band.twitter_url) {
      if(this.band.twitter_url.indexOf("http") == -1)
        this.band.set('twitter_url', "http://" + this.band.twitter_url);

      if(this.validable.validate("check")) {
        this.band.set('twitter_disabled', false)
        this.band.saveResource(['twitter_url','twitter_disabled']);
        this.close();
      } else {
        this.band.set('twitter_disabled', true)
        this.band.set('twitter_url', '');
      }
    } else {
      this.band.saveResource(['twitter_url']);
      this.close();
    }
  }
});

App.Views.ControlPanel.BandStore = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-profile-store",
  bandBinding: "App.Controllers.ControlPanel.band.details",
  validable: null,

  didInsertElement: function() {
    this.set('validable' , this.$('input.validate').validate({
        errorMsg: "Invalid link. Please try again.",
        defaultPlaceholder: "http://www.shopify.com/yourpage",
        regex: /((https|http):\/\/)?((w{3}\.)?)(\S+)\/(?:[^\s()\\\[\]{};:'",<>?]){1,}/
      })
    );
  },

  save: function() {
    if(this.band.store_url) {
      if(this.band.store_url.indexOf("http") == -1)
        this.band.set('store_url', "http://" + this.band.store_url);

      if(this.validable.validate("check")) {
        this.band.set('store_disabled', false);
        this.band.saveResource(['store_url','store_disabled']);
        this.close();
      } else {
        this.band.set('store_disabled', true);
        this.band.set('store_url', '');
      }
    } else {
      this.band.saveResource(['store_url']);
      this.close();
    }
  }
});

/*********** Music Tab *************/

App.Views.ControlPanel.Music = Ember.View.extend({
  templateName: "control-panel-music",
  albumList: App.Controllers.ControlPanel.albumList,
  currAlbum: App.Controllers.ControlPanel.albumList.get('content')[0],
  albumSlider: null,

  didInsertElement: function () {
    /* bxslider album nav */
    /*
      bxSlider uses this code to determine element widths:
        $firstChild = $parent.children(':first');
        childrenWidth = $firstChild.width();
      Metamorph's script tags will mess this up, so we're using a modified bxSlider that lets us set the selector we need.
    */
    var that = this;

    this.set('albumSlider', $('#cpanel ul.albums').bxSlider({
        controls: false,
        displaySlideQty: 3,
        moveSlideQty: 1,
        infiniteLoop: false,
        hideControlOnEnd: true,
        childSelector: 'li'
      })
    );

    $('.prev-set').click(function(){
      that.albumSlider.goToPreviousSlide();
      return false;
    });
    
    $('.next-set').click(function(){
      that.albumSlider.goToNextSlide();
      return false;
    });

    this.selectFirstAlbum();

  },

  selectFirstAlbum: function() {
    this.$("ul.albums li.album:eq(1)").addClass('active');
  },

  addAlbum: function() {
    var that = this;

    newAlbum = App.Models.Album.create({
      band_id: App.Controllers.ControlPanel.band.details._id,
      songList: Ember.ArrayController.create({content: []})
    });

    newAlbum.saveResource()
      .done(function() {
        that.albumList.pushObject(newAlbum);
      });

    this.albumSlider.goToLastSlide();

  }
});

App.Views.ControlPanel.AlbumListItem = Ember.View.extend({
  templateName: "control-panel-music-album-list-item",
  classNames: ["album"],
  tagName: "li",

  downloadTypeChanged: function () {
    var that = this;
    if(this.album.get('selected_download_type')) {
      var downloadType = this.album.get('selected_download_type').value;

      this.album.set('download_type', downloadType);

      if(downloadType === "custom") {
        this.getCustomPrice();
      } else if(downloadType === "itunes") {
        this.album.set('price', "");
        this.getiTunesStoreLink();
      } else if(downloadType === "amazon") {
        this.album.set('price', "");
        this.getAmazonStoreLink();
      } else if(downloadType === "free") {
        this.album.set('price', 0);
      }else {
        this.album.set('price', downloadType);
      }
    }
  }.observes("album.selected_download_type"),
  getCustomPrice: function() {
    var that = this;
    $("#custom-price-pop").showPop();
    view = App.Views.ControlPanel.MediaCustomPrice.create({
      media: that.get('album')
    })
    view.replaceIn("#custom-price-pop");
  },
  getiTunesStoreLink: function() {
    var that = this;

    $("#itunes-media-link-pop").showPop();
    view = App.Views.ControlPanel.MediaiTunesLink.create({
      media: that.get('album')
    })
    view.replaceIn("#itunes-media-link-pop");
  },
  getAmazonStoreLink: function() {
    var that = this;
    $("#amazon-media-link-pop").showPop();
    view = App.Views.ControlPanel.MediaAmazonLink.create({
      media: that.get('album')
    })
    view.replaceIn("#amazon-media-link-pop");
  },

  changeAlbum: function(evt) {
    this.highlightAlbum();
    this.get('parentView').set('currAlbum', this.get('album'));
  },

  highlightAlbum: function() {
    this.$().siblings().removeClass("active");
    this.$().addClass("active");
  },

  showSettings: function(evt) {
    var that = this;

    $('#album-settings-pop').showPop();
    view = App.Views.ControlPanel.AlbumSettings.create({
      album: that.get('album')
    })
    view.appendTo("#album-settings-pop");
  }
});

App.Views.ControlPanel.AlbumSettings = App.Views.ControlPanel.PopUp.extend(App.Mixins.AutoSave,{
  templateName: "control-panel-music-album-settings",
  upload_cover_art: "upload-cover-art",

  didInsertElement: function() {
    this.initializeAutoSaveFor(this.album);
  },

  saveSettings: function() {
    this.close();
  },

  deleteCover: function() {

    var that = this;

    $('#delete-album-cover-pop').showPop();
    view = App.Views.ControlPanel.AlbumCoverDeleteConfirm.create({
      album: that.album
    });
    view.replaceIn('#delete-album-cover-pop');

  },

  deleteAlbum: function() {
    var that = this;

    $('#delete-album-pop').showPop();
    view = App.Views.ControlPanel.AlbumDeleteConfirm.create({
      album: that.album,
      parentView: that
    });
    view.replaceIn('#delete-album-pop');
  },
  selectCover: function() {
    this.$("input.album-cover").trigger('click');
  },
  uploadCover: function() {
    var that = this;
    var uploadForm = this.$("input:file.album-cover", "form");
    var csrfToken = $('meta[name=csrf-token]').prop('content');
    this.album.uploadCover(uploadForm, csrfToken);
  }
});

App.Views.ControlPanel.AlbumCoverDeleteConfirm = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-music-delete-album-cover-confirm",
  deleteAlbumCover: function () {
    var that = this;
    
    this.album.set('remove_cover_image', true);
    this.album.saveResource(['remove_cover_image'])
      .done(function() {
        that.album.set('cover_image', null);
        that.album.set('remove_cover_image', false);
      });
    this.close();
  }
})

App.Views.ControlPanel.AlbumDeleteConfirm = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-music-delete-album",
  deleteAlbum: function () {
      this.album.destroyResource();
      App.Controllers.ControlPanel.albumList.removeObject(this.album);
      
      this.close();
      this.get('parentView').destroy();
      $('#album-settings-pop').showPop();
    }
});

App.Views.ControlPanel.SongList = Ember.View.extend({
  templateName: "control-panel-music-song-list",
  scrollbar: null,
  didInsertElement: function() {
    var that = this;

    this.scrollbar = this.$('#songs').jScrollPane();
  },
  // TODO: this sucks. Nag the ember.js guys.
  reinitializeScrollbar: function() {
    this.scrollbar.data('jsp').reinitialise();
  },
  createSong: function() {
    var that = this;
    var newSong = App.Models.Song.create({
      album_id: this.get('parentView').currAlbum._id
    });
    this.songs.pushObject(newSong);
  },

  albumChanged: function() {
    this.reinitializeScrollbar();
  }.observes('window.views.control_panel.music.currAlbum.songs')
});

App.Views.ControlPanel.SongListItem = Ember.View.extend(App.Mixins.AutoSave, {
  tagName: "tr",
  num: "num",
  didInsertElement: function() {
    console.log('inserting song');
    this.initializeAutoSaveFor(this.song);

    if(this.song.isNew()){
      this.get('parentView').reinitializeScrollbar();
      this.$('input.name').focus();
    }
  },

  selectOpeningSong: function() {
    App.Controllers.ControlPanel.albumList.forEach(function(album, index, enumerable){
      album.songList.forEach(function(song, index, enumerable) {
        if(song.get('opening_song')){
          song.set('opening_song', false);
          song.saveResource(['opening_song']);
        }
      })
    })

    this.song.set('opening_song', true);
    this.song.saveResource(['opening_song']);
  },

  encodingMonitorStarted: function() {
    if(this.song.encodingStatusTimer) {
      $('.song-encoding').show().delay(4000).fadeOut();
    }
  }.observes('song.encodingStatusTimer'),

  change: function(evt) {
    console.log(this);
    console.log('Song: downloadTypeChanged changed');
    if($(evt.target).hasClass('download-type')) {
      var that = this;
      if(this.song.get('selected_download_type')) {
        var downloadType = this.song.get('selected_download_type').value;

        this.song.set('download_type', downloadType);

        if(downloadType === "custom") {
          this.getCustomPrice();
        }
        else if(downloadType === "itunes") {
          this.song.set('price', "");
          this.getiTunesStoreLink();
        }
        else if(downloadType === "amazon") {
          this.song.set('price', "");
          this.getAmazonStoreLink();
        } 
        else if(downloadType === "free") {
          this.song.set('price', 0);
          this.song.saveResource();
        } 
        else {
          this.song.set('price', downloadType);
          this.song.saveResource();
        }
      }
    } else {
      this.song.saveResource();
    }
  },

  getCustomPrice: function() {
    var that = this;
    $("#custom-price-pop").showPop();
    view = App.Views.ControlPanel.MediaCustomPrice.create({
      media: that.song
    })
    view.replaceIn("#custom-price-pop");
  },

  getiTunesStoreLink: function() {
    var that = this;

    $("#itunes-media-link-pop").showPop();
    view = App.Views.ControlPanel.MediaiTunesLink.create({
      media: that.song
    })
    view.replaceIn("#itunes-media-link-pop");
  },

  getAmazonStoreLink: function() {
    var that = this;

    $("#amazon-media-link-pop").showPop();
    view = App.Views.ControlPanel.MediaAmazonLink.create({
      media: that.song
    })
    view.replaceIn("#amazon-media-link-pop");
  },

  uploadSong: function(e) {
    var that = this;

    $("#upload-song-pop").showPop();
    view = App.Views.ControlPanel.SongUpload.create({
      song: that.song
    });
    view.replaceIn("#upload-song-pop");
  },
  setLyrics: function(evt) {
    var that = this;
    $("#lyrics-pop").showPop();
    view = App.Views.ControlPanel.SongLyrics.create({
      song: that.song
    });
    view.replaceIn($("#lyrics-pop"));
  },

  deleteSong: function(view, e) {
    var that = this;

    $('#delete-song-pop').showPop();
    view = App.Views.ControlPanel.SongDeleteConfirm.create({
      song: that.song
    });
    view.replaceIn('#delete-song-pop');
  },

  editSlideshow: function(view, e) {
    var that = this;

    this.$('.fullscreen .selector-dropdown').removeClass('active');
    $("#slideshow-pop").showPop();
    view = App.Views.ControlPanel.SongSlideshow.create({
      song: that.song,
      arrowsVisible: false
    });
    view.replaceIn("#slideshow-pop");
  },

  editVideo: function(view, e) {
    var that = this;
    this.$('.fullscreen .selector-dropdown').removeClass('active');
    $('#video-pop').showPop();
    view = App.Views.ControlPanel.SongVideo.create({
      song: that.song
    })
    view.replaceIn("#video-pop");
  }
});

App.Views.ControlPanel.SongDeleteConfirm = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-music-delete-song-confirm",
  deleteSong: function () {
    if(!this.song.isNew()){
      this.song.destroyResource();
    }
    window.views.control_panel.music.currAlbum.songList.removeObject(this.song);
    this.close();
  }
})

App.Views.ControlPanel.MediaCustomPrice = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-music-media-custom-price",
  setCustomPrice: function() {
    this.media.saveResource(['download_type', 'price']);
    this.close();
  }
});

App.Views.ControlPanel.MediaiTunesLink = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-music-itunes-media-link",
  validator: null,

  didInsertElement: function() {
    this.set('validator', this.$('input.validate').validate({
      regex: /((ftp|http|https):\/\/)?(\w+:{0,1}\w*@)?itunes.apple.com(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
      defaultPlaceholder: 'http://itunes.apple.com/us/album/sabo',
      errorMsg: "Invalid link. Please try again."
    }));
  },

  setiTunesLink: function() {
    if(this.media.itunes_store_link) {
      if(this.media.itunes_store_link.indexOf("http") == -1)
        this.media.set('itunes_store_link', "http://" + this.media.itunes_store_link);

      if(this.validator.validate("check")) {
        this.media.set('download_disabled', false);
        this.media.saveResource(['download_disabled', 'download_type', 'itunes_store_link']);
        this.close();      
      } else {
        this.media.set('itunes_store_link', '');
        this.media.set('download_disabled', true);
      }
    } else {
      this.media.saveResource(['itunes_store_link']);
      this.close();
    }
  }
});

App.Views.ControlPanel.MediaAmazonLink = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-music-amazon-media-link",
  validator: null,

  didInsertElement: function() {
    this.set('validator', this.$('input.validate').validate({
      regex: /((ftp|http|https):\/\/)?(\w+:{0,1}\w*@)?amazon.com(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
      defaultPlaceholder: 'http://www.amazon.com/Beast-Boys/',
      errorMsg: "Invalid link. Please try again."
    }));
  },

  setAmazonLink: function() {
    if(this.media.amazon_store_link) {
      if(this.media.amazon_store_link.indexOf("http") == -1)
        this.media.set('amazon_store_link', "http://" + this.media.amazon_store_link);

      if(this.validator.validate("check")) {
        this.media.set('download_disabled', false);
        this.media.saveResource(['download_disabled', 'download_type', 'amazon_store_link']);
        this.close();
      } else {
        this.media.set('amazon_store_link', '');
        this.media.set('download_disabled', true);
      }
    } else {
      this.media.saveResource(['amazon_store_link']);
      this.close();
    }
  }
});

App.Views.ControlPanel.SongUpload = App.Views.ControlPanel.PopUp.extend({
  templateName : "control-panel-music-upload-song",
  tagName      : "div",
  startUpload  : function() {
    var form = this.$('form');
    this.song.uploadSongFile(form);
    this.close();
  },

  selectSongFile : function () {
    this.$('input:file.song-file').click();
  }

});

App.Views.ControlPanel.SongSlideshow = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-music-song-slideshow",
  tagName: "div",
  didInsertElement: function() {
    this.$('.content').jScrollPane();
    this.sortableSlides();
  },

  slideshowTransitionChanged: function(evt) {
    this.song.set('slideshow_trans_time', this.$('input.transition-time').val());
    this.song.saveResource(['slideshow_trans_time']);
  },

  transitionStyleChanged: function() {
    this.song.set('slideshow_trans_style', this.song.selected_transition_style.value);
    this.song.saveResource(['slideshow_trans_style']);
  }.observes('song.selected_transition_style'),

  sortableSlides: function() {
    var that = this;

    this.$("ul.images").sortable({
      items: "li",
      update: function(evt, ui) {

        $.each(that.$("ul.images li.image"), function(index, elem) {
          var photoId = $(elem).find("input[name='_id']").val();

          var photo = that.song.slideshow.filterProperty('_id', photoId)[0];

          if(photo && !photo.isNew()) {
            photo.set('order', index + 1);
            photo.saveResource(['order']);
          }
        });
      }
    }).disableSelection();
  },

  saveSlideshow: function() {
    // this.song.saveResource(['slideshow_trans_time','slideshow_trans_style']);
    this.close();
  },

  addPhotoSlot: function() {
    var newOrder = this.$("ul.images li.image").length;

    this.get('song').slideshow.pushObject(App.Models.Photo.create({
      song_id: this.get('song')._id,
      order: newOrder
    }));
  }
});

App.Views.ControlPanel.SongVideo = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-music-song-video",
  tagName: "div",
  didInsertElement: function() {
    this.$('.textarea-scroll').jScrollPane();
  },
  setVideo: function() {
    this.song.saveResource(['video_embed_tag']);
    this.close();
  }
})

App.Views.ControlPanel.SongLyrics = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-music-lyrics",
  didInsertElement: function() {
    this.$('.textarea-scroll').jScrollPane();
  },

  setLyrics: function() {
    this.song.saveResource(['lyrics']);
    this.close();
  },

  change: function(evt) {
    console.log('textarea changed');
  }
});

/*********** Gallery Tab *************/
App.Views.ControlPanel.Photo = Ember.View.extend({
  templateName: "control-panel-gallery-photo",
  classNames: ['image'],
  classNameBindings: ['empty'],
  tagName: "li",
  empty: true,
  fileChanged: function() {
    if(this.photo.file) {
      console.log("has url");
      this.set('empty', false);
    }
  }.observes('photo.file'),

  select: function()  {
    this.$("input.photo-file").trigger('click');
  },

  upload: function() {
    var uploadForm = this.$("input:file.photo-file", "form");
    var uploadData;

    if(this.$("input[name='band_id']").val() != "")
      uploadData = this.$("input[name='band_id'], input[name='order']", "form").serializeArray();
    else
      uploadData = this.$("input[name='song_id'], input[name='order']", "form").serializeArray();

    var csrfToken = $('meta[name=csrf-token]').prop('content');
    this.photo.upload(uploadForm, uploadData, csrfToken);
  },

  delete: function() {
    if(this.photo.imageable_type == "Band")
      App.Controllers.ControlPanel.photoList.removeObject(this.photo);
    else
      this.get('parentView').song.slideshow.removeObject(this.photo);

    this.photo.destroyResource();
  }
});

App.Views.ControlPanel.Video = Ember.View.extend({
  templateName: "control-panel-gallery-video",
  classNames: ['video'],
  classNameBindings: ['empty'],
  tagName: "li",
  empty: true,
  //Change this name
  embeddedChanged: function() {
    if(this.video.get('url')) {
      this.set('empty', false);
      this.getVideoData();
    }
  }.observes('video.url'),

  didInsertElement: function() {
    if(this.video.get('url')) {
      this.set('empty', false);
    }
  },

  delete: function() {
    App.Controllers.ControlPanel.videoList.removeObject(this.video);
    this.video.destroyResource();
  },
  embed: function() {
    console.log('Show Embed Video');

    that=this;
    $('#embed-video-pop').showPop();
    var view = App.Views.ControlPanel.EmbedVideo.create({
      video: that.video
    });
    view.replaceIn('#embed-video-pop');
  },
  getVideoData: function() {
    var vidUrl = this.video.get('url');

    if(this.video.isNew()) {
      if(vidUrl.indexOf("vimeo") > -1) {
        this.setVimeoThumbnail(vidUrl);
      } else if(vidUrl.indexOf("youtu.be") > -1 || vidUrl.indexOf("youtube") > -1){
        this.setYoutubeThumbnail(vidUrl);
      }
    }
  },
  setYoutubeThumbnail: function(url) {
    var that = this;
    var vid;

    vid = getParameterByName(url, 'v');

    this.video.set('vid_id', vid);
    this.video.set('provider', 'youtube');
    this.video.set('img_url', "http://img.youtube.com/vi/"+vid+"/1.jpg");

    $.getJSON('http://gdata.youtube.com/feeds/api/videos/' + vid +  '?v=2&alt=json-in-script&callback=?', {}, function(data) {
      console.log(data);
      if(that.video.title == "null") {
        that.video.set('title', data.entry.title.$t);
      }
      that.video.saveResource();
      that.rerender();
    });

  },
  setVimeoThumbnail: function (url) {
    var vid;
    var that = this;

    vid = url.substring(url.lastIndexOf("/") + 1);

    this.video.set('vid_id', vid);
    that.video.set('provider', 'vimeo');

    $.getJSON('http://www.vimeo.com/api/v2/video/' + vid + '.json?callback=?', {format: "json"}, function(data) {
      console.log(data);
      if(that.video.title == "null")
        that.video.set('title', data[0].title);

      that.video.set('img_url', data[0].thumbnail_small);
      that.video.saveResource();
      that.rerender();
    });

  }
});

App.Views.ControlPanel.Gallery = Ember.View.extend(App.Mixins.AutoSave, {
  templateName: "control-panel-gallery",
  tagName: "form",
  settings: App.Controllers.ControlPanel.band.gallery,
  videoList: App.Controllers.ControlPanel.videoList,
  photoList: App.Controllers.ControlPanel.photoList,

  didInsertElement: function() {
    this.$().tabs();
    this.$('div.panel').jScrollPane();

    this.sortableVideos();
    this.sortablePhotos();

    this.initializeAutoSaveFor(this.settings);
  },

  sortablePhotos: function() {
    var that = this;

    this.$("#gallery-photos ul.images").sortable({
      items: "li",
      update: function(evt, ui) {

        $.each($("#gallery-photos ul.images li.image"), function(index, elem) {
          var photoId = $(elem).find("input[name='_id']").val()

          var photo = that.photoList.filterProperty('_id', photoId)[0];

          if(photo && !photo.isNew()) {
            photo.set('order', index + 1);
            photo.saveResource(['order']);
          }
        });
      }
    }).disableSelection();
  },

  sortableVideos: function() {
    var that = this;

    this.$("#gallery-videos ul.video").sortable({
      items: "li",
      update: function(evt, ui) {
        $.each($("#gallery-videos ul.video li.video"), function(index, elem) {
          var videoId = $(elem).find("input[name='_id']").val()

          var video = that.videoList.filterProperty('_id', videoId)[0];

          if(video && !video.isNew()) {
            video.set('order', index + 1);
            video.saveResource(['order']);
          }
        });
      }
    }).disableSelection();
  },

  transitionChanged: function(evt) {
    // Workaround for TransitionTime, binding for input type=number not working
    this.resourceIsDirty = true;
    this.settings.set('g_transition_time', this.$('input.transition-time').val());
    this.autoSave();
  },
  transitionStyleChanged: function() {
    this.settings.set('g_transition_style', this.settings.selected_transition_style.value);
  }.observes('settings.selected_transition_style'),

  addVideoSlot: function() {
    var newOrder = $("#gallery-videos ul.video li.video").length;

    this.videoList.pushObject(App.Models.Video.create({
      band_id: App.Controllers.ControlPanel.band.details._id,
      order: newOrder
    }));
  },

  addPhotoSlot: function() {
    var newOrder = $("#gallery-photos ul.images li.image").length;

    this.photoList.pushObject(App.Models.Photo.create({
      band_id: App.Controllers.ControlPanel.band.details._id,
      order: newOrder
    }));
  }
});

App.Views.ControlPanel.EmbedVideo = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-gallery-embed-video",
  tagName: "div",
  url: null,
  title: null,
  didInsertElement: function() {
    this.$('.textarea-scroll').jScrollPane();
  },
  save: function() {
    this.video.set('title',this.get('title'));
    this.video.set('url',this.get('url'));
    this.video.saveResource();
    this.close();
  }
});

/*********** Account Tab *************/

App.Views.ControlPanel.Account = Ember.View.extend(App.Mixins.AutoSave, {
  templateName: "control-panel-account",
  tagName: 'div',
  band: App.Controllers.ControlPanel.band.details,
  user: App.Controllers.ControlPanel.account.user,
  creditCard: App.Controllers.ControlPanel.account.creditCard,
  plan: App.Controllers.ControlPanel.account.plan,
  didInsertElement: function () {
    this.initializeAutoSaveFor(this.band, ['custom_domain']);
  },
  changeInfo: function() {
    $('#account-info-pop').showPop();
    var view = App.Views.ControlPanel.AccountInfo.create();
    view.replaceIn("#account-info-pop");
  },
  changeBillingInfo: function() {
    $('.popup.billing-info').showPop();
    var view = App.Views.ControlPanel.BillingInfo.create();
    view.replaceIn("#billing-info-pop");
  },
  changePlan: function() {
    $('.popup.plan').showPop();
    var view = App.Views.ControlPanel.ChangePlan.create();
    view.replaceIn("#change-plan-pop");
  },
  confirmCancelAccount: function() {
    $('#cancel-plan-pop').showPop();
    view = App.Views.ControlPanel.CancelAccount.create();
    view.replaceIn('#cancel-plan-pop');

  }
});

App.Views.ControlPanel.AccountInfo = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-account-info",
  user: App.Controllers.ControlPanel.account.user,
  band: App.Controllers.ControlPanel.band.details,
  save: function(){
    this.user.saveResource();
    this.band.saveResource(['name', 'spindle_url']);
    this.close();
  }
});

App.Views.ControlPanel.BillingInfo = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-account-billing-info",
  creditCard: App.Controllers.ControlPanel.account.creditCard,
  didInsertElement: function() {

    $('a.security-code').click(function() {
      $('.popup.security-code').showPop();
    });
    $('a.confirm-plan').click(function() {
      $('.popup.confirm-plan').showPop();
    });

  },
  save: function(){
    this.creditCard.saveResource();
    this.close();
  }
});

App.Views.ControlPanel.ChangePlan = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-account-change-plan",
  availablePlans: App.Controllers.ControlPanel.appConstants.plans,
  user: App.Controllers.ControlPanel.account.user,
  plan: App.Controllers.ControlPanel.account.plan,
  confirmPlanChange: function() {
    this.$('.popup.confirm-plan').showPop();
  },
  confirmCancelAccount: function() {
    $('#cancel-plan-pop').showPop();
    view = App.Views.ControlPanel.CancelAccount.create();
    view.replaceIn('#cancel-plan-pop');
  },
  savePlan: function() {
    var selectedPlanID = this.$("li.plan.active input[name='plan_id']").val();

    that=this;
    $.each(this.availablePlans.content, function(index, availablePlan){
      if(availablePlan._id == selectedPlanID) {
        $.each(availablePlan, function(key,val) {
          that.plan.set(key, val);
        });
      that.user.set('plan_id', availablePlan._id);
      }
    });
    this.user.saveResource(['plan_id']);

    this.$('.popup.confirm-plan').showPop();
    this.close();
  },
  closeConfirmPlanChange: function () {
    this.$('.popup.confirm-plan').showPop();
  }
  
});

App.Views.ControlPanel.Plan = Ember.View.extend({
  tagName: 'li',  
  classNames: ['plan'],
  user: App.Controllers.ControlPanel.account.user,
  didInsertElement: function() {
    if(this.user.get('plan_id') == this.info._id)
      this.$().addClass('active');
  },
  imgUrl: Ember.computed(function() {
    return "i/popups/plan-" + this.info.name +".png";
  }).property('info.name'),
  capName: Ember.computed(function(){
    return capitalize(this.info.name);
  }).property('info.name'),
  selectPlan: function(evt) {
    this.$().siblings().removeClass('active');
    this.$().addClass('active');
  }
});

App.Views.ControlPanel.CancelAccount = App.Views.ControlPanel.PopUp.extend({
  templateName: "control-panel-account-cancel-plan",
  user: App.Controllers.ControlPanel.account.user,
  cancelAccount: function() {
    this.user.set('status', "cancelled");
    this.user.saveResource(['status']);
    this.close();
  }
});
