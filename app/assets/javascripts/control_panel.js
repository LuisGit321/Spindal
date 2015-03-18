//= require ./models/control-panel
//= require ./controllers/control-panel
//= require_tree ./templates/control-panel
//= require ./views/control-panel
//= require cpanel

// Spindal.stateManager is useful for debugging,
// but don't use it directly in application code.

var stateManager = App.stateManager = App.StateManager.create();
App.initialize(stateManager);

jQuery(function() {
  stateManager.send('ready');
});

