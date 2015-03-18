App.Views.Sidebar.Albums = Ember.View.extend({
  templateName: 'player-albums',
  tagName: 'ul',
  classNames: ["albums"],
  albumSliderOptions: {
  	slideExpr: 'li.album',
  	activePagerClass: 'activeSlide',
	  fx: "scrollHorz",
	  prev: ".prev-album",
	  next: ".next-album",
	  timeout: 0,
	  after: function() {
	  	var $ht = $(this).height()+150;
			$(this).parent().animate({height: $ht});
	  }
  },
  activeSlideIndex: 0,
  slideAdded: null,

  albumsBinding: 'App.Controllers.ControlPanel.albumList',

  albumVisibilityChanged: function() {
  	console.log('album visibility changed');
  	var that = this;

		this.$().cycle('destroy');

  	setTimeout(function() {
			that.startAlbumSlider();
		}, 0);
  }.observes('albums.@each.visibility_disabled'),
  
  didInsertElement: function() {
		this.startAlbumSlider();
		this.activateAlbumChangeEffects();

		this.addAlbumsObservers();
	},
	
	startAlbumSlider: function(options) {
		this.$().cycle($.extend({}, this.albumSliderOptions, options));
	},

	arrayWillChange: function(arr,startPos,removeCount) {
		if(removeCount == 0) {
			this.set('slideAdded', true);
		} else {
			this.set('slideAdded', false);
		}

		this.set('activeSlideIndex', this.$('li.album').index(this.$('li.album:visible')));
		this.$().cycle('destroy');
	},

	arrayDidChange: function(arr,startPos,removeCount) {
		var that = this;
		var slideIndex = 0;

		slideIndex = this.get('activeSlideIndex');
		
		if(slideIndex == -1)
			slideIndex = startPos;

		if((this.get('slideAdded') == false) && (slideIndex == startPos)) {
			sliceIndex = slideIndex + 1;
		}

		setTimeout(function() {
			that.startAlbumSlider({startingSlide: slideIndex});
		}, 0);

		this.set('slideAdded', null);
	},
	
	activateAlbumChangeEffects: function() {
		var that = this;

		this.$(".prev-album, .next-album").click(function() {
			that.$(".album.title h2").removeClass("active").next().hide('slideUp');
		  $('nav.artist').removeClass('pushed-title pushed'); //Does not seem to do anything
		});
	},

	addAlbumsObservers: function() {
		this.albums.get('content').addArrayObserver(this);
	}
});