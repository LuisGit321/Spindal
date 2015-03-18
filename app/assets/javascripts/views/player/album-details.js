App.Views.Sidebar.AlbumsDetails = Ember.View.extend({
  templateName: 'player-album-details',
  classNames: ["album", "title"],
  
  buyLinkText: function() {
  	var that = this;
  	var downloadType = this.album.download_type;
  	var buyLinkText;

  	if(downloadType == null)
  		return 'Download';

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
	  		buyLinkText = "Buy $" + that.album.get('price');
	  		break;
  	}
  	return buyLinkText;
  }.property('album.download_type', 'album.price'),

  buyLink: function() {
  	var that = this;
  	var downloadType = this.album.download_type;
  	var buyLink;

  	switch(downloadType) {
	  	case 'amazon':
	  		buyLink = that.album.get('amazon_store_link');
	  		break;
	  	case 'itunes':
	  		buyLink = that.album.get('itunes_store_link');
	  		break;
	  	default:
	  		buyLink = "#";
	  		break;
  	}
  	return buyLink;
  }.property('album.download_type', 'album.amazon_store_link', 'album.itunes_store_link'),
   
  didInsertElement: function() {
  	this.activateAlbumDetailsPanel();
  	this.activateShareLink();
	},

	activateAlbumDetailsPanel: function() {
		this.$("h2.title").click(function() {
		  $(this).toggleClass("active").next().slideToggle();
		});
	},

	activateShareLink: function() {
		this.$(".menu.share span.label").click(function() {
		  $(this).toggleClass("active").next().toggle();
		  $('#spindal nav.artist').toggleClass("pushed-title");
		});
	},

	getAlbum: function() {

		var that = this;
  	var downloadType = this.album.download_type;

  	switch(downloadType) {
	  	case 'amazon':
	  		window.open(that.album.get('amazon_store_link'));
	  		break;
	  	case 'itunes':
	  		window.open(that.album.get('itunes_store_link'));
	  		break;
	  	case null:
	  	case '':
	  	case 'free':
	  		break;
	  	default:
	  		that.buyAlbum();
	  		break;
  	}
  },

  buyAlbum: function() {
    view = App.Views.Player.BuyAlbum.create({
    	album: this.album
  	}).append();
	}
});