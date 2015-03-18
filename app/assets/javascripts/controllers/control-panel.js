App.Controllers.ControlPanel.account = Ember.Object.create({
  user: App.Models.User.create(),
  creditCard: App.Models.CreditCard.create(),
  plan: App.Models.Plan.create(),
  setup: function(json) {
    if(json)
      this.setupUser(json);
  },
  setupUser: function(json) {
    user = this.user;

    $.each(App.Models.userAttrs, function(index, val) {
        user.set(val, json[val]);
    });

    this.setupCreditCard(json['credit_card']);
    this.setupPlan(json['plan']);

  },
  setupPlan: function(json) {
    if(json){
      plan = this.plan;
      $.each(json, function(key,val) {
        plan.set(key,val);
      });
    }
  },
  setupCreditCard: function(json) {
    if(json){
      creditCard = this.creditCard;
      $.each(App.Models.creditCardAttrs, function(index, val) {
        creditCard.set(val, json[val]);
      });
    }

    this.bindCreditCardSelects();
  },
  bindCreditCardSelects: function() {
    this.creditCard.reopen({
      cardTypeChanged: function() {
        if(this.selected_type)
          this.set('type', this.selected_type.value);
        else
          this.set('type', null);
      }.observes('selected_type'),

      cardYearChanged: function() {
        if(this.selected_expiry_year)
          this.set('expiry_year', this.selected_expiry_year.value);
        else
          this.set('expiry_year', null);
      }.observes('selected_expiry_year'),

      cardMonthChanged: function() {
        if(this.selected_expiry_month)
          this.set('expiry_month', this.selected_expiry_month.value);
        else
          this.set('expiry_month', null);
      }.observes('selected_expiry_month')
    });
  }
});

App.Controllers.ControlPanel.liveShowList = Ember.ArrayController.create({
  content: [],
  setup: function(json) {
    list = this;
    $.each(json, function(index, obj) {
      list.pushObject(App.Models.LiveShow.create(obj));
    });
  }
});

App.Controllers.ControlPanel.videoList = Ember.ArrayController.create(App.Mixins.Sortable, {
  content: [],

  setup: function(json) {
    var order = 1;
    var list = this;

    if(json) {
      $.each(json, function(index, obj) {
        list.pushObject(App.Models.Video.create(obj));
        order += 1;
      });
    }
  
    this.sortContent();

    var numVideos = this.get('content').length;
    if(numVideos < 15) {
      for(i=15; i>numVideos; i--) {
        this.pushObject(App.Models.Video.create({
          band_id: App.Controllers.ControlPanel.band.details._id,
          order: order
        }));
        order += 1;
      }
    }
  }
});

App.Controllers.ControlPanel.appConstants = Ember.Object.create({
  bandGenre: Ember.ArrayController.create(),
  bandSubGenre: Ember.ArrayController.create(),
  blogPlatform: Ember.ArrayController.create(),
  emailProvider: Ember.ArrayController.create(),
  plans: Ember.ArrayController.create(),
  setup: function(data) {
    this.bandGenre.set('content', data.band_genre);
    this.bandSubGenre.set('content', data.band_sub_genre);
    this.blogPlatform.set('content', data.blog_platform);
    this.emailProvider.set('content', data.email_provider);
    this.plans.set('content', data.plan);
  },
  bandSubGenreFiltered: function(){
    if(App.Controllers.ControlPanel.band.details.selected_genre){
      return this.get("bandSubGenre").get('content').filterProperty("genre_id", App.Controllers.ControlPanel.band.details.selected_genre._id);
    }
    else{
      return this.get("bandSubGenre").get('content');
    }
  }.property('App.Controllers.ControlPanel.band.details.selected_genre').cacheable()
});
