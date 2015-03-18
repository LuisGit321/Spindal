App.Models.albumAttrs = ['title', 'band_id', 'price', 'download_type', 'amazon_store_link', 'itunes_store_link', 'record_label', 'release_year', 'title_disabled','visibility_disabled','download_disabled','share_disabled','num_song_plays_disabled','parental_advisory_disabled','release_date_disabled','record_label_disabled'];
App.Models.galleryAttrs = ['_id', 'g_photos_disabled', 'g_videos_disabled', 'g_transition_time', 'g_transition_style'];
App.Models.logoAttrs = ['_id','band_logo_name','band_id', 'file', 'font_name', 'font_color', 'font_size', 'alignment', 'remove_file'];
App.Models.bandAttrs = ['genre_id', 'sub_genre_id', 'remove_bg_image', 'city', 'state', 'country', 'fb_url','store_url','twitter_url', 'paypal_email', 'paypal_currency', 'play_button_disabled',  'logo_disabled', 'live_shows_disabled','news_disabled', 'fb_disabled', 'twitter_disabled', 'store_disabled', 'bio_disabled', 'custom_domain' ,'news_email_disabled','email_list'];
App.Models.songAttrs = ['title', 'album_id', 'price', 'download_type', 'amazon_store_link', 'itunes_store_link', 'lyrics', 'slideshow_trans_time', 'slideshow_trans_style', 'video_embed_tag', 'opening_song', 'disabled', 'download_disabled', 'lyrics_disabled', 'fullscreen_disabled'];

App.Models.Band = Ember.Resource.extend({
  resourceUrl: '/api/bands',
  resourceName: 'band',
  resourceIdField: '_id',
  resourceProperties: App.Models.bandAttrs,

  bgUploadUrl: function() {
    var resourceUrl = this.get('resourceUrl');
    var bgUploadUrl   = resourceUrl.concat('/' + this.get('_id')).concat('/upload_background');
    return bgUploadUrl;
  }.property('resourceUrl'),

  uploadBackground: function(uploadForm, csrfToken) {

    var that = this;
    var url = this.get('bgUploadUrl');

    $.ajax(url, {
        files   : uploadForm,
        iframe  : true,
        async   : false,
        headers : { 'X-CSRF-Token' : csrfToken },
        // Success is being skipped by jquery-iframe-transport plugin,
        // So the hack in the error() callback.
        success : function (data, textStatus, jqXHR) {
          alert("Your file was successfully uploaded");
          var band = $.parseJSON(jqXHR.responseText);
          that.set('bg_image', band.bg_image);
          return true;
        },
        error : function (jqXHR, textStatus, errorThrown) {
          var responseText = jqXHR.responseText;
          
          if(undefined !== responseText && responseText.match(/^\{.*\}$/)) {
            var band = $.parseJSON(jqXHR.responseText);
            that.set('bg_image', band.bg_image);
            return true;
          } else {
            alert("Error: The file you tried to upload did not work. Please try again.");
            return false;
          }
        }
    });
  }
});

App.Models.Album = Ember.Resource.extend({
  resourceUrl: '/api/albums',
  resourceName: 'album',
  resourceIdField: '_id',
  resourceProperties: App.Models.albumAttrs,

  coverUrl: function() {
    var resourceUrl = this.get('resourceUrl');
    var coverUrl   = resourceUrl.concat('/' + this.get('_id')).concat('/upload_cover');
    return coverUrl;
  }.property('resourceUrl'),

  uploadCover: function(uploadForm, csrfToken) {

    var that = this;
    var url = this.get('coverUrl');

    $.ajax(url, {
        files   : uploadForm,
        iframe  : true,
        async   : false,
        headers : { 'X-CSRF-Token' : csrfToken },
        // Success is being skipped by jquery-iframe-transport plugin,
        // So the hack in the error() callback.
        success : function (data, textStatus, jqXHR) {
          alert("Your file was successfully uploaded");
          var album = $.parseJSON(jqXHR.responseText);
          that.set('cover_image', album.cover_image);
          return true;
        },
        error : function (jqXHR, textStatus, errorThrown) {
          var responseText = jqXHR.responseText;
          
          if (undefined !== responseText && responseText.match(/^\{.*\}$/)) {
            var album = $.parseJSON(jqXHR.responseText);
            that.set('cover_image', album.cover_image);
            return true;
          } else {
            alert("Error: The file you tried to upload did not work. Please try again.");
            return false;
          }
        }
    });
  },

  initiatePurchaseUrl: function() {
    return location.protocol.concat('//').concat(location.host)
    .concat('/purchases').concat('/initiate').concat('/album').concat('/' + this.get('_id'));
  }.property('resourceUrl'),

  getPurchaseInfo: function() {
    var that = this;

    var url = this.get('initiatePurchaseUrl');
    var purchaseKey;

    $.ajax(url)
      .fail(function() {
        that.set('purchaseError', true);
        that.set('purchaseErrorReason', "Please check your connection and try again");
      })
      .done(function(data) {
        if(data.purchaseKey) {
          that.set('purchaseKey', data.purchaseKey);
          that.set('purchaseUrl', data.purchaseUrl);        
        } else {
          that.set('purchaseError', true);
          that.set('purchaseErrorReason', 'There was an error, please try again later');
        }
      });
  }
});

App.Models.Song = Ember.Resource.extend({
    resourceUrl: '/api/songs'
  , resourceName: 'song'
  , resourceIdField: '_id'
  , resourceProperties: App.Models.songAttrs
  , fileUploaded: function () {
      if(this.get('file')) {
        var url = this.get('file').url;
        if (undefined != url) {
          return 0 < url.length;
        } else {
          return false;
        }
      }

      return false;        
    }.property('file', 'fileUploaded')

  , fileMissing: function () {
      return !this.get('fileUploaded');
    }.property('file', 'fileUploaded')

  , fileEncoded: function() {
      if(this.get('encoding_details') && this.get('encoding_details').state == 'finished') {
        clearInterval(this.encodingStatusTimer);
        return true;
      }
      else {
        return false;
      }
    }.property('encoding_details.state')

  , uploadUrl: function () {
      var _id         = this.get('_id');
      var resourceUrl = this.get('resourceUrl');
      var uploadUrl   = resourceUrl.concat('/', _id, '/upload');
      return uploadUrl;
    }.property('_id', 'resourceUrl')

  , uploadSongFile: function (form) {
    var song      = this;
    var url       = this.get('uploadUrl');
    var csrfToken = $('meta[name=csrf-token]').prop('content');
    $.ajax(url, {
        files   : $('input:file', form)
      , iframe  : true
      , headers : { 'X-CSRF-Token' : csrfToken }
      , beforeSend : function () {
          song.set('fileUploading', true);
          song.set('encoding_details', null);
          song.set('file', '');
        }

      // Success is being skipped by jquery-iframe-transport plugin,
      // ergo the hack in the error() callback.
      , success : function (data, textStatus, jqXHR) {
          song.set('file', data.file);
          song.set('encoding_details', null);
          return true;
        }

      , error : function (jqXHR, textStatus, errorThrown) {
          var responseText = jqXHR.responseText;
          // If the response text is JSON formatted, then:
          if (undefined != responseText && responseText.match(/^\{.*\}$/)) {
            var data = JSON.parse(responseText);
            song.set('file', data.file);
            song.set('encoding_details', null);
            song.startEncodedPolling();
            return true;
          } else {
            alert("Error: The file you tried to upload did not work. Please try again.");
            return false;
          }
        }
      , complete : function () { song.set('fileUploading', false); }
    });
  },

  startEncodedPolling: function() {
    var that = this;

    if(this.get('fileUploaded') && !this.get('fileEncoded')) {
      this.set('encodingStatusTimer', setInterval(function() {
          that.findResource();
        }, 120000)
      );
    } else {
      clearInterval(this.encodingStatusTimer);
    }
  },

  initiatePurchaseUrl: function() {
    return location.protocol.concat('//').concat(location.host)
    .concat('/purchases').concat('/initiate').concat('/song').concat('/' + this.get('_id'));
  }.property('resourceUrl'),

  getPurchaseInfo: function() {
    var that = this;

    var url = this.get('initiatePurchaseUrl');
    var purchaseKey;

    $.ajax(url)
      .fail(function() {
        that.set('purchaseError', true);
        that.set('purchaseErrorReason', "Please check your connection and try again");
      })
      .done(function(data) {
        if(data.purchaseKey) {
          that.set('purchaseKey', data.purchaseKey);
          that.set('purchaseUrl', data.purchaseUrl);        
        } else {
          that.set('purchaseError', true);
          that.set('purchaseErrorReason', 'There was an error, please try again later');
        }
      });
  }
});

App.Models.Gallery = Ember.Resource.extend({
  resourceUrl: '/api/bands',
  resourceName: 'band',
  resourceIdField: '_id',
  resourceProperties: App.Models.galleryAttrs
});

App.Models.Logo = Ember.Resource.extend({
  resourceUrl: '/api/logos',
  resourceName: 'logo',
  resourceIdField: '_id',
  resourceProperties: App.Models.logoAttrs,
  uploadUrl: function () {
    var resourceUrl = this.get('resourceUrl');
    var uploadUrl   = resourceUrl.concat('/upload');
    return uploadUrl;
  }.property('resourceUrl'),
});

App.Models.Photo = Ember.Resource.extend({
  resourceUrl: '/api/photos',
  resourceName: 'photo',
  resourceIdField: '_id',
  resourceProperties: ['band_id', 'url', 'order'],
  uploadUrl: function () {
    var resourceUrl = this.get('resourceUrl');
    var uploadUrl   = resourceUrl.concat('/upload');
    return uploadUrl;
  }.property('resourceUrl'),

  upload: function(uploadForm, uploadData, csrfToken) {

    var that = this;
    var url = this.get('uploadUrl');

    console.log(uploadData);

    $.ajax(url, {
        files   : uploadForm,
        data    : uploadData,
        processData: true,
        iframe  : true,
        async   : false,
        headers : { 'X-CSRF-Token' : csrfToken },
        // Success is being skipped by jquery-iframe-transport plugin,
        // So the hack in the error() callback.
        success : function (data, textStatus, jqXHR) {
          alert("Your file was successfully uploaded");
          var photo = $.parseJSON(jqXHR.responseText);
          console.log(photo); 
          that.set('_id', photo._id);
          that.set('file', photo.file);
          that.set('imageable_type', photo.imageable_type);
          return true;
        },
        error : function (jqXHR, textStatus, errorThrown) {
          var responseText = jqXHR.responseText;
          
          if (undefined != responseText && responseText.match(/^\{.*\}$/)) {
            var photo = $.parseJSON(jqXHR.responseText);
            that.set('_id', photo._id);
            that.set('file', photo.file);
            that.set('imageable_type', photo.imageable_type);
            return true;
          } else {
            alert("Error: The file you tried to upload did not work. Please try again.");
            return false;
          }
        }
    });
  }
});

App.Models.NewsFeed  = Ember.Resource.extend({
	resourceUrl: '/api/news_feed',
	resourceName: 'news_feed',
	resourceProperties: ['entry_id','title','url','summary','published','author','feed_type'],
	isTwitter: function() {
	    var value = this.feed-type === 'twitter';
	    console.log(value);
	    return value;
	  },
	isInstagram:  Ember.computed(function()
	{	
		if( this.feed_type === 'instagram')
			return true;
	    return false;
	}).property('feed_type'),
	date: Ember.computed(function(){
		
	    return $.timeago(this.published);
	  }).property('published')
	  
	 
});

App.Models.EmailList = Ember.Resource.extend({
	resourceUrl: '/api/news_feed/email_list',
	resourceName: 'email_list',
	resourceProperties: ['web_id','name'],
});
