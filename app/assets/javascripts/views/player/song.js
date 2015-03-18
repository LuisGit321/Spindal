App.Views.Sidebar.Song = Ember.View.extend({
  templateName: 'player-song',
  tagName: 'div',
  classNames: ['player_songs'],
  
  jplayer: null,
  slideshow: null,
  domID: null,
  domSelector: null,
  jPlayerSelector: null,
  jContainerSelector: null,
  activateSong: false,

  buyLinkText: function() {
    var that = this;
    var downloadType = this.song.download_type;
    var buyLinkText;

    if(downloadType == null)
      return "Download";

    switch(downloadType) {
      case 'free':
        buyLinkText = "Download";
        break;
      case 'amazon':
        buyLinkText = "Amazon";
        break;
      case 'itunes':
        buyLinkText = "iTunes";
        break;
      default:
        buyLinkText = "Buy $" + that.song.get('price');
        break;
    }
    return buyLinkText;
  }.property('song.download_type', 'song.price'),

  buyLink: function() {
    var that = this;
    var downloadType = this.song.download_type;
    var buyLink;

    switch(downloadType) {
      case 'amazon':
        buyLink = that.song.get('amazon_store_link');
        break;
      case 'itunes':
        buyLink = that.song.get('itunes_store_link');
        break;
      default:
        buyLink = "#";
        break;
    }
    return buyLink;
  }.property('song.download_type', 'song.amazon_store_link', 'song.itunes_store_link'),

  openingSongObserver: function() {
    var that = this;

    if(this.song.opening_song){
      console.log(this.song.title + " is opening Song");
      window.views.player.playButton.addObserver('startPlaying', that, that.playOpeningSong);
    } else {
      console.log(this.song.title + " is NOT opening Song");
      // window.views.player.playButton.removeObserver('startPlaying', that, that.playOpeningSong);
    }
  }.observes('song.opening_song'),

  playOpeningSong: function() {
    console.log('observerd Play button click from: ');
    this.openSongAccordion();
    this.play();
  },

  beforeRender: function() {
    console.log('rendering');
    this.set('domID', ("song-" + randString(8)) );
    this.set('domSelector', "#"+this.get('domID'));

    this.set('jPlayerSelector', "#" + this.get('domID') + ' .jp-player');
    this.set('jContainerSelector', "#" + this.get('domID') + ' .jp-audio');
  },

  didInsertElement: function() {
    var that = this;

  	this.enableVolumeControl();
    this.activateShareLink();
    this.activateLyrics();
    this.enableBuySong();

    var closeSong = function() {
      console.log('active song clicked again');
      that.set('activateSong', false);
      $("#ac-" + that.domID + "~ label").unbind('click', closeSong);
    }

    $("input[name='accordion-song']").change(function() {
      console.log('global radio change triggered');
      if(!$("#ac-" + that.domID).is(":checked"))
        that.set('activateSong', false);
    });

    $("#ac-" + that.domID).change(function() {
      console.log('local radio change triggered');
      if($("#ac-" + that.domID).is(":checked")) {
        that.set('activateSong', true);
        $("#ac-" + that.domID + "~ label").bind('click', closeSong);
      }
    })
  },

  openSongAccordion: function() {
    this.moveToAlbum();
    this.moveToSong();
  },

  moveToAlbum: function() {
    var albumSlide = $(this.domSelector).parents('li.album');
    while(!albumSlide.is(":visible")) {
      $(this.domSelector).parents("ul.albums").cycle('next');
    }
  },

  moveToSong: function() {
    this.set('activateSong', true);
  },

  toggleSongPlay: function() {
    console.log('toggling by observing activate');
    if(this.get('activateSong'))
      this.play();
    else
      this.destroyPlayer();
  }.observes('activateSong'),

  destroyPlayer: function() {
    console.log('Destroying');
    //This is not destroying
    $(this.jPlayerSelector).jPlayer("destroy");
    //Destroy Seek Slider
    //Destroy Volume Slider
    this.set('jplayer', null);

    this.stopSlideshow();
  },

  play: function() {
    this.initializeJPlayer();
    this.initializePlayerSeekBar();
    this.initializePlayerVolumeBar();
  },

  initializeJPlayer: function() {
    var that = this;
    console.log('initializing player');
    
    $.jPlayer.timeFormat.padMin = false;

    this.set('jplayer', $(this.jPlayerSelector).jPlayer({
      ready: function() {
        console.log('on player ready');
        $(this).jPlayer("setMedia", {
          mp3: that.song.file.url//,
          // oga: "http://keebodonline.elementfx.com/jplayer-project/music/music.ogg"
        }).jPlayer("play");
      },
      cssSelectorAncestor: this.jContainerSelector,
      cssSelector: {
        playHead: ".jp-seek-bar .ui-slider-handle",
        volumeBarValue: ".jp-volume-bar .ui-slider-handle"
      },
      oggSupport: false,
      swfPath: "http://keebodonline.elementfx.com/jplayer-project/js/Jplayer.swf",
      supplied: "mp3",//, oga",
      wmode: "window",
      solution: "html, flash",
      verticalVolume: true,     
      timeupdate: function(event) {
        currentTime = parseInt(event.jPlayer.status.currentTime);
        totalDuration = parseInt(event.jPlayer.status.duration);
        percent = (currentTime / totalDuration) * 100;
        that.$(that.domSelector + ' .jp-seek-bar').slider("option", "value", percent);
      },
      play: function(event) {
        that.startSlideshow();
      },
      ended: function(event) {
        console.log('song ended');
        that.stopSlideshow();
        that.closeSong();
        that.nextSong();
      },
      pause: function(event) {
        that.stopSlideshow();
      }
    }));
  },

  initializePlayerSeekBar: function() {
    var that = this;

    this.$(this.domSelector + ' .jp-seek-bar').slider({
     min: 0,
     max: 100,
     animate: true,
     slide: function(event, ui) {
       var currentPercentage = ui.value;
       that.$(that.jPlayerSelector).jPlayer("playHead", currentPercentage);
     }

    });
  },

  initializePlayerVolumeBar: function() {
    var that = this;

    $(this.domSelector + ' .jp-volume-bar').slider({
      orientation: 'vertical',
      ranges: "min",
      min: 0,
      max: 100,
      value: 60,
      animate: true,
      slide: function(event, ui) {
        var volume = ui.value / 100;
        $(that.jPlayerSelector).jPlayer("volume", volume);
      }
    });
  },

  enableVolumeControl: function() {
    var that = this;
    /* UnBIND this */
    this.$(this.domSelector + " .jp-volume-max").click(function() {
      $(this).toggleClass("active");
      that.$(that.domSelector + " .jp-volume-bar").toggleClass("invisible");
    });
  },

  activateShareLink: function() {
    var that = this;
    var domSelector = "#" + this.get('domID');

    this.$(this.domSelector + " .menu.share span.label").click(function() {
      $(this).toggleClass("active").next().toggle();
      $('#spindal nav.artist').toggleClass("pushed-title");
    });
  },

  activateLyrics: function() {
    console.log('activating lyrics');
    var that = this;

    this.$(this.domSelector + " .lyrics a.show.lyrics").click(function() {
      var lyricsView = window.views.player.lyrics;
      
      that.$(that.domSelector + " a.show.lyrics").toggleClass('active');
    
      lyricsView.set('song', that.get('song'));
      lyricsView.$().toggleClass('active');
    });

  },

  startSlideshow: function() {
    preloadImage(this.song.slideshow.get('content')[0].file.url);

    this.slideshow = App.Views.Player.Slideshow.create({
      photoList: this.song.slideshow,
      transTime: this.song.slideshow_trans_time,
      transStyle: this.song.slideshow_trans_style,
      arrowsVisible: false
    });

    this.slideshow.appendTo("body");
  },

  stopSlideshow: function() {
    if(this.slideshow) {
      this.slideshow.destroy();
    }
  },

  closeSong: function() {
    this.set('activateSong', false);
  },

  nextSong: function() {
    console.log('next song');
    $($(this.domSelector).parent('div').nextAll('div')[0]).find('label').click();
  },

  enableBuySong: function() {
    var that = this;

    $(this.domSelector + ' li.buy a').click(function() {
      var downloadType = that.song.download_type;

      switch(downloadType) {
        case 'amazon':
          window.open(that.song.get('amazon_store_link'));
          break;
        case 'itunes':
          window.open(that.song.get('itunes_store_link'));
          break;
        case null:
        case '':
        case 'free':
          break;
        default:
          that.buySong();
          break;
      }
    });
  },

  buySong: function() {
    var that = this;
    var album = App.Controllers.ControlPanel.albumList.filterProperty('_id', that.song.album_id)[0];

    view = App.Views.Player.BuySong.create({
      song: that.song,
      album: album
    }).append();
  }
});