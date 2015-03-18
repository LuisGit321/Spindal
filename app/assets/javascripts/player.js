//= require ./helpers
//= require ./models/player
//= require ./controllers/player

//= require ./states
//= require ./templates/player
//= require ./views/player

window.views = {
  player: {},
  control_panel: {}
}

//TODO: User contains band info, no need to setup separately
// Setup Band Info
App.Controllers.ControlPanel.band.setup(band_data);

//Render Background Slider
window.views.player.background = App.Views.Background.create();

// Setup Gallery -> Photos
App.Controllers.ControlPanel.photoList.setup(band_data.photos);

//Setup Ablums and Songs
App.Controllers.ControlPanel.albumList.setup(band_data.albums);


//Render Player Band Logo
window.views.player.logo = App.Views.Player.BandLogo.create().appendTo("#band_logo");;

//Render Player Artist Details
App.Views.Sidebar.ArtistDetails.create().appendTo("#spindal nav.profile");

//Render Sidebar Albums
App.Views.Sidebar.Albums.create().appendTo('#spindal div.albums');


//Render Lyrics Container
window.views.player.lyrics = App.Views.Sidebar.Lyrics.create().appendTo('body');

//Render Play button
window.views.player.playButton = App.Views.PlayButton.create().append();

//Fetch News Feeds and EmailList
App.Controllers.ControlPanel.newsFeed.setup();
App.Controllers.ControlPanel.emailList.setup();

/* show popup function */
(function ($) {
  $.fn.showPop = function() {
    $(this).toggleClass('visible');
    if ($(this).hasClass("visible")) {
      $(this).vAlign();
      $('body').append('<div class="lightbox-screen" />');
    } else {
      $('.lightbox-screen').remove();
    }
  };
})(jQuery);

/* vertical alignment */
(function ($) {
$.fn.vAlign = function() {
  return this.each(function(i){
  var box = $(this).height();
  var viewport = $(window).height();
  var offset = Math.ceil((viewport - box) / 2);
  $(this).css('top', offset);
  });
};
})(jQuery);
  
// album navigation
// $("#spindal .prev-album, #spindal .next-album").click(function() {
//   $("#spindal .album.title h2").removeClass("active").next().hide('slideUp');
//   $("#spindal .accordion").accordion("activate", -1);
//   $('#spindal nav.artist').removeClass('pushed-title pushed');
// });

// show and hide album details
// $("#spindal .menu.share span.label").click(function() {
//   $(this).toggleClass("active").next().toggle();
//   $('#spindal nav.artist').toggleClass("pushed-title");
// });

// $("#spindal .album.title h2").click(function() {
//   $(this).toggleClass("active").next().slideToggle();
// });

// expand and collapse tracks
// $("#spindal .accordion").accordion({
//   active: false,
//   collapsible: true
// });

// $('#spindal .accordion').bind('accordionchangestart', function(event, ui) {
//   if ($(this).children('div.title').hasClass('ui-state-active')) {
//     $('#spindal nav.artist').removeClass("pushed");
//   }
//   else {
//     $('#spindal nav.artist').addClass("pushed");
//   }
// });

// show and hide volume control
// $("#spindal .volume.toggle").click(function() {
//   $(this).toggleClass("active");
// });

// hide and show the left-hand menu
$("a.spindal").click(function() {
  $("#spindal").toggleClass("active");
  $("a.spindal").toggleClass("active");
});

$("a.nav-profile").click(function() {
  $(this).toggleClass("active");
  $("nav.profile").slideToggle();
});

// $("a.nav-news").click(function() {
//   $("li.nav-news").toggleClass("active");
// })

// $("a.nav-gallery").click(function() {
//   $("li.nav-gallery").toggleClass("active");
// })

// $("#spindal ul.albums").cycle({
//   slideExpr: 'li.album',
//   fx: "scrollHorz",
//   prev: ".prev-album",
//   next: ".next-album",
//   timeout: 0,
//   after: onAfter
// });

// variate album height based on number of songs

// function onAfter(curr, next, opts, fwd) {
//  var $ht = $(this).height();
//  $(this).parent().animate({height: $ht});
// }

// hide and show the panes
//$("div.pane a.pane").click(function() {
 // $(this).closest("div.pane").toggleClass("active");
//});

$("#spindal a.show.lyrics").click(function() {
  showArtistPane('lyrics');
});

function showArtistPane(clickedPane) {
  var panes = ['news', 'lyrics', 'live', 'bio'];
  $.each(panes, function(index, paneClass) {
    if(paneClass != clickedPane){
      $("div.spindal.pane." + paneClass).removeClass("active");
    }
  });
  $("div.spindal.pane." + clickedPane).toggleClass("active");
  if(clickedPane = 'news')
  {
	
	  var newView = App.Views.ControlPanel.BandNewsFeed.create();
	  newView.replaceIn("#news-container");
	 
  }
}

// $("#spindal a.show.bio").click(function() {
//   $("div.spindal.pane.news").removeClass("active");
//   $("div.spindal.pane.lyrics").removeClass("active");
//   $("div.spindal.pane.live").removeClass("active");
// })
// $("#spindal a.show.live").click(function() {
//   $("div.spindal.pane.news").removeClass("active");
//   $("div.spindal.pane.lyrics").removeClass("active");
//   $("div.spindal.pane.bio").removeClass("active");
//   $("div.spindal.pane.live").toggleClass("active");
// })
// $("#spindal a.show.news").click(function() {
//   $("div.spindal.pane.lyrics").removeClass("active");
//   $("div.spindal.pane.bio").removeClass("active");
//   $("div.spindal.pane.live").removeClass("active");
//   $("div.spindal.pane.news").toggleClass("active");
// })

// page on-load animation
setTimeout(function(){
  $("#spindal").toggleClass("active");
  $("a.spindal.show").toggleClass("active");
}, 1000);

