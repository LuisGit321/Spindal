App.Views.Player.BuySong = App.Views.ControlPanel.PopUp.extend({
  templateName: "player-buy-song",
  classNames: ['buy-album-song', 'tile', 'popup'],

  willInsertElement: function() {
    this.clearPurchaseValues();
  	this.initPurchase();
  },

  didInsertElement: function() {
  	this.$().showPop();
  },

  clearPurchaseValues: function() {
    this.song.set('purchaseKey', null);
    this.song.set('purchaseUrl', null);
    this.song.set('purchaseError', null);
  },

  initPurchase: function() {
  	this.song.getPurchaseInfo();
  },

  closeDialog: function() {
    var that = this;
    setTimeout(function() {
      that.close()
    }, 0);
  }
});