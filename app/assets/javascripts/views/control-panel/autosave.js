App.Mixins.AutoSave = Ember.Mixin.create({
  resource: null,
  attributes: undefined,
  autoSaveTrigger: null,
  resourceIsDirty: false,
  initializeAutoSaveFor: function(resource, attributes) {
    this.resource = resource;
    this.attributes = attributes;
  },
  autoSave: function() {
    var that = this;

    if(this.resource) {
      this.resource.saveResource(this.attributes)
      .fail( function(e) {
        if(that.resourceIsDirty) {
          that.showDirtyResourceMsg();
          that.scheduleAutoSave(8000);
        }
      })
      .done(function() {
        that.resourceIsDirty = false;
        that.hideDirtyResourceMsg();
      });
    }
  },
  delayedAutoSave: function() {
    console.log('Delayed Autosave');
    this.scheduleAutoSave(3000);
  },
  scheduleAutoSave: function(milliSeconds) {
    that = this;
    clearTimeout(that.autoSaveTrigger);

    if(that.resourceIsDirty) {
      that.autoSaveTrigger = setTimeout(function() {
          that.autoSave();
        }, milliSeconds);
    }
  },
  showDirtyResourceMsg: function() {
    $("#dirty_resource").show();
  },
  hideDirtyResourceMsg: function() {
    $("#dirty_resource").hide();
  },
  click: function(evt) {
    if($(evt.target).hasClass('light')) {
      console.log('light clicked');
      this.resourceIsDirty = true;
      this.autoSave();
    }
  },
  change: function(evt) {
    if(!$(evt.target).is('input:file')) {
      console.log('Input changed');
      this.resourceIsDirty = true;
      this.autoSave();
    }
  }
});