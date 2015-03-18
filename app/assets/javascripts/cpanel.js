  App.Controllers.ControlPanel.appConstants.setup(app_constants);

  //TODO: User contains band info, no need to setup separately
  // Setup Band Info
  if(App.Controllers.ControlPanel.band.details.live_shows.length > 0) {
    App.Controllers.ControlPanel.liveShowList.setup(App.Controllers.ControlPanel.band.details.live_shows);
  }

  //Setup User ->  Info, CreditCard and plan
  App.Controllers.ControlPanel.account.setup(user_data);

  // Setup Gallery -> Videos
  App.Controllers.ControlPanel.videoList.setup(band_data.videos)

  //Render Profile Tab
  var view = App.Views.ControlPanel.Band.create();
  view.appendTo("#profile-panel");

  //Render Music Tab
  window.views.control_panel.music = App.Views.ControlPanel.Music.create();
  window.views.control_panel.music.appendTo("#music-panel");

  //Render Gallery Tab
  var gallery = App.Views.ControlPanel.Gallery.create();
  gallery.appendTo("#gallery-panel");

  //Render Account Tab
  var account = App.Views.ControlPanel.Account.create();
  account.appendTo("#account-panel");

$('.datepicker').datepicker({ dateFormat: 'dd/mm' });
$('.framepicker').datepicker({ dateFormat: 'M d, yy' });

/* logout functions */
$('#logout').click(function() {
  $('.popup.logout').showPop();
});
$('.popup.logout a.yes').click(function(){
  $('.popup.logout').showPop();
  $('#cpanel').fadeOut().delay(1000).fadeIn();
});

/* minimize button */
$('#cpanel-tabs li.minimize').click(function() {
  $('.panel').slideToggle();
  $(this).toggleClass('minimized');
});

/* popups options */
// $('a.exit, a.cancel, a.ok').click(function() {
//   $(this).closest('.popup').showPop();
// });

// $('.popup.album-settings a.delete').click(function() {
//   $('.popup.delete-album').showPop();
// });

// $('#songs td.status a.delete').click(function() {
//   $('.popup.delete-song').showPop();
// });
// $('a.change.account.info').click(function() {
//   $('.popup.account-info').showPop();
// });
// $('a.change.billing.info').click(function() {
//   $('.popup.billing-info').showPop();
// });
// $('a.security-code').click(function() {
//   $('.popup.security-code').showPop();
// });
// $('a#change-plan').click(function() {
//   $('.popup.plan').showPop();
// });
// $('a.cancel-account').click(function() {
//   $('.popup.cancel-account').showPop();
// });

// $('a.confirm-plan').click(function() {
//   $('.popup.confirm-plan').showPop();
// });

/* popups - profile */
// $('a.create.band-logo').click(function() {
//   $('.popup.band-logo').showPop();
// });
// $('a.edit.bio').click(function() {
//   $('.popup.bio').showPop();
//   $('.popup.bio .textarea-scroll').jScrollPane();
// });
// $('a.edit.live').click(function() {
//   $('.popup.live').showPop();
//   $('.popup.live #events').jScrollPane();
// });
$('#events td.status a.delete').click(function() {
  $('.popup.delete-event').showPop();
});
// $('a.edit.news').click(function() {
//   $('.popup.news').showPop();
// });
// $('a.edit.facebook').click(function() {
  // $('.popup.facebook').showPop();
// });
// $('a.edit.twitter').click(function() {
//   $('.popup.twitter').showPop();
// });
// $('a.edit.store').click(function() {
//   $('.popup.store').showPop();
// });

/* popups - music */

// $('a.add-song').click(function() {
//   $('.popup.add-song').showPop();
// });

/* popups - stats */
$('#stats-panel div.panel').jScrollPane();

$('a.google-analytics').click(function() {
  $('.popup.google-analytics').showPop();
  $('.popup.google-analytics .textarea-scroll').jScrollPane();
});

/* lights! */
$(function() {
  // $('.light').live('click', function(){
    // $(this).toggleClass('disabled');
    // $(this).parent('li.row').toggleClass('disabled');
  // });
  // $('.light').live('hover', function(){
  //   $(this).parent('li.row').toggleClass('hover');
  // });
});

/* custom selectbox */
// function activateSelectBox(jQElements) {
//   jQElements.selectBox('create')
//     .change(function() {
//       // if($(this).val() === "itunes-album-link") {
//       //   $('.popup.itunes-album-link').showPop();
//       // }
//     });
// }

/* select box watching */
$('.selector .selector-arrow').live('click', function(){
  $(this).parent().toggleClass('active');
});

/* textarea blur */
$(".popup.textarea textarea")
  .autoResize({
    animateCallback : function() {
      $(this).closest('.textarea-scroll').jScrollPane();
    }
  })
  .focus(function(event) {
    // Erase text from inside textarea
    $(this).text("");
    // Disable text erase
    $(this).unbind(event);
  });

/* select a spindal plan */
// $('ul.plans li.plan').click(function() {
//   $(this).siblings().removeClass('active');
//   $(this).toggleClass('active');
// });

/* gallery tab options */
// $('#gallery-panel form').tabs();
// $('#gallery-panel form div.panel').jScrollPane();
// $('#gallery-panel ul.images').sortable().disableSelection();
// $('#gallery-panel #gallery-videos li.image a').click(function(){
//   $('.popup.gallery.video').showPop();
//   $('.popup.gallery.video .textarea-scroll').jScrollPane();
// });

/* #cpanel effects */
$('#cpanel')
  .tabs({
    selected: 1,
    fx: {height: 'toggle', opacity:'toggle', duration:'normal'}
  })
  .draggable({
    handle: '#top-bar',
    containment: 'window'
  })
  .vAlign();

/* Sidebar Artist Details */
// $('.show-gallery-arrows').click(function() {
//   $(this).toggleClass('active');
//   $('ul.gallery-arrows').toggleClass('active');
// });

// $('#gallery-photos-button').click(function() {
//   $('#gallery-videos-button').removeClass('active');
// });
// $('#gallery-videos-button').click(function() {
//   $('#gallery-photos-button').removeClass('active');
// });

/* band logo font switching */
$("li.font.face .selector-dropdown").click(function() {
  $(this).toggleClass("selectBox-menuShowing");
  $("#fontList").toggleClass("active");
});


$('#fontList li').click(function(){
  var chosen = $(this).index();
  $('#fontSelector option:selected')
    .removeAttr('selected');
  $('#fontSelector option')
    .eq(chosen)
    .attr('selected',true);
  $('.selected').removeClass('selected');
  $(this).addClass('selected');
});

/* Custom Spinner */
function initializeSpinner() {
  var opts = {
  lines: 11, // The number of lines to draw
  length: 6, // The length of each line
  width: 2, // The line thickness
  radius: 5, // The radius of the inner circle
  rotate: 0, // The rotation offset
  color: '#fff', // #rgb or #rrggbb
  speed: 0.8, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: true, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};
return new Spinner(opts);
}


/* Show Spinner on AJAX */
$('body').ajaxStart(function() {
  if(!window.spinner) {
    window.spinner = initializeSpinner();
  }
  
  var target = document.getElementById('ajax_loading');
  window.spinner.spin(target);
});

$('body').ajaxComplete(function() {
  if(window.spinner) {
    window.spinner.stop();
  }
});