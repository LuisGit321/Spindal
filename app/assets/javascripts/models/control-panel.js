// TODO: populate these values using Rails, so back-end changed do not break them.
App.Models.newsAttrs = ['blog_platform', 'blog_url', 'email_api_key', 'email_api_username' , 'email_api_password' , 'email_list' ,'email_provider_id', 'blog_platform_id', 'blog_url', 'fb_handle','twitter_handle', 'instagram_handle', 'news_fb_disabled', 'news_twitter_disabled', 'news_blog_disabled', 'news_email_disabled' , 'news_instagram_disabled'];
App.Models.userAttrs = ['_id', 'plan_id', 'status', 'first_name', 'last_name', 'email', 'password'];
App.Models.creditCardAttrs = ['_id','type', 'number', 'security_code', 'billing_zip_code', 'expiry_month', 'expiry_year'];

App.Models.User = Ember.Resource.extend({
  resourceUrl: '/api/users',
  resourceName: 'user',
  resourceIdField: '_id',
  resourceProperties: App.Models.userAttrs
});

App.Models.CreditCard = Ember.Resource.extend({
  resourceUrl: '/api/credit_cards',
  resourceName: 'credit_card',
  resourceIdField: '_id',
  resourceProperties: App.Models.creditCardAttrs,
  numberLastFour: Ember.computed(function() {
    return this.get('number')%10000;
  }).property('number')
});

App.Models.LiveShow = Ember.Resource.extend({
  resourceUrl: '/api/live_shows',
  resourceName: 'live_show',
  resourceIdField: '_id',
  resourceProperties: ['band_id', 'day', 'venue', 'city', 'state', 'ticket_url', 'tickets_disabled'],
  location: Ember.computed(function(key, value) {
    // getter
    if (arguments.length === 1) {
        var city = this.get('city');
        var state = this.get('state');
        if(!city && !state)
          return "";
        else
          return (city + ',' + state);
    } else {
      var loc = value.split(",");
      this.set('city', loc[0]? loc[0]:"");
      this.set('state', loc[1]? loc[1]:"");

      return value;
    }
  }).property('city','state')
});

App.Models.Video = Ember.Resource.extend({
  resourceUrl: '/api/videos',
  resourceName: 'video',
  resourceIdField: '_id',
  resourceProperties: ['band_id','title', 'url', 'img_url', 'provider' ,'order']
});

App.Models.Plan = Ember.Object.extend({
  capName: Ember.computed(function(){
    return capitalize(this.name);
  }).property('name')
});
