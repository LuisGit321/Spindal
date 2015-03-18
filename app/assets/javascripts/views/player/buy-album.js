App.Views.Player.BuyAlbum = App.Views.ControlPanel.PopUp.extend({
  templateName: "player-buy-album",
  classNames: ['buy-album-song', 'tile', 'popup'],

  willInsertElement: function() {
    this.clearPurchaseValues();
  	this.initPurchase();
  },

  didInsertElement: function() {
  	this.$().showPop();
  },

  clearPurchaseValues: function() {
    this.album.set('purchaseKey', null);
    this.album.set('purchaseUrl', null);
    this.album.set('purchaseError', null);
  },

  initPurchase: function() {
  	this.album.getPurchaseInfo();
  },

  closeDialog: function() {
    var that = this;
    setTimeout(function() {
      that.close()
    }, 0);
  }
});