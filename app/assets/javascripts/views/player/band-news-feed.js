/************ News Feeds *************/
App.Views.ControlPanel.BandNewsFeed = Ember.View.extend({
	  templateName: 'player-band-news-feed',
	  contentBinding: 'App.Controllers.ControlPanel.newsFeed',
	  classNames: ['spindal','pane','news'],
	  togglePane: function() {
		  	this.$().toggleClass("active");
		  },
	  didInsertElement: function()
	  {
			 
		    //this.$().toggleClass("active");
		    var that = this;
		    setTimeout(function() {
		        that.togglePane()},
		        3);	  
		   function removeMenuSeclection()
		   {        
			   	    $('#noFeedError').hide();	
					$("#all-news").removeClass("selected");
					$("#fb-news").removeClass("selected");
					$("#twitter-news").removeClass("selected");
					$("#instagram-news").removeClass("selected");
					$("#blog-news").removeClass("selected");
					
			}
		  
		  $('#all-news').click(function() {
			
			removeMenuSeclection();
			$("#all-news").addClass("selected");
			$('#loading-container').show();
		    $('#news-container').hide();
		    
			App.Controllers.ControlPanel.newsFeed.setup();
			
		  });
		  $('#fb-news').click(function() {
			
			removeMenuSeclection();
			$("#fb-news").addClass("selected");
			$('#loading-container').show();
			$('#news-container').hide();
			App.Controllers.ControlPanel.newsFeed.setup('facebook');
		
		  });
		  
		  $('#instagram-news').click(function() {
				
				removeMenuSeclection();
				$("#instagram-news").addClass("selected");
				$('#loading-container').show();
				$('#news-container').hide();
				App.Controllers.ControlPanel.newsFeed.setup('instagram');
			
			  });
		  
		  $('#twitter-news').click(function() {
			
			removeMenuSeclection();
			$("#twitter-news").addClass("selected");
			$('#loading-container').show();
			$('#news-container').hide();
			App.Controllers.ControlPanel.newsFeed.setup('twitter');
		  });
		  
		  $('#blog-news').click(function() {
			
			removeMenuSeclection();
			$("#blog-news").addClass("selected");
			$('#loading-container').show();
			$('#news-container').hide();
			App.Controllers.ControlPanel.newsFeed.setup('blog');
		  });
	  	}
	});