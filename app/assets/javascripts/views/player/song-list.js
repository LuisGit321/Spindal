App.Views.Sidebar.SongList = Ember.View.extend({
	templateName: 'player-song-list',
	classNames: ['tracks', 'menu'],
	accordion: null,
	didInsertElement: function() {
		this.shareSongChanged();
	},

	shareSongChanged: function() {

		if(this.album.share_disabled)
			this.$('div.menu.share > span').addClass('invisible');
		else
			this.$('div.menu.share > span').removeClass('invisible');

	}.observes('album.share_disabled')
});