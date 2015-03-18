FactoryGirl.define do
	factory :user do
		sequence(:email) {|n| "User#{n}@spindaltest.com"}
		# password: spindal -- without salt
		password "$2a$10$bVOg4Ft0Tg1NZvuYeqnn/OqFmEJXdB6esHGEJ7bVzANObRMkLefpa"
		sequence(:first_name) {|n| "User#{n}"}
		last_name "Test"
		status "active"
	end

	factory :credit_card do
		type "Visa"
		number "1234432112344321"
		security_code "123"
		billing_zip_code "12345"
		expiry_month 6
		expiry_year 2022
	end

	factory :song do
		title {"Song #{track_no}"}
	end

	factory :album do
		sequence(:title) {|n| "Title#{n}"}
		sequence(:cover_image) { |n| "/i/albums/album-0#{n}-q90.jpg"}
		release_year "2012"

	end

	factory :band do
		name "BandX"
		spindle_url {"spindal.com/#{name}"}
		sequence(:city) {|n| "City#{n}"}
		sequence(:state) {|n| "State#{n}"}
		sequence(:country) {|n| "Country#{n}"}
		bio {"This is the bio of #{name}"}
	  fb_url {"facebook.com/#{name}"}
	  twitter_url {"twitter.com/#!#{name}"}
	  store_url {"shopify.com/#{name}"}
	  paypal_email {"donate@#{name}.com"}
	  paypal_currency "EUR"
	  twitter_handle {"#{name}"}
	  fb_handle {"#{name}"}
	  blog_url {"#{name}.blogger.com"}
	  email_api_key "23498rfi3u349urw98ru"

	  bg_image nil
	  
	  play_button_disabled true
		logo_disabled true
		live_shows_disabled true
		news_disabled true
		fb_disabled true
		twitter_disabled true
		store_disabled true
		bio_disabled true 
	  news_fb_disabled true
	  news_twitter_disabled true
	  news_blog_disabled true
	  news_email_disabled true

		g_photos_disabled false
	  g_videos_disabled false
	  g_transition_time 4.5
	  g_transition_style "normal"
  
	end


	factory :live_show do
		day {Time.now.strftime("%Y-%m-%d")}
		sequence(:venue) {|n|"Venue#{n}"}
		city "Austin"
		state "Texas"
		tickets_disabled true
		sequence(:ticket_url) {|n| "http://thegaslightvenue/#{n}"}
	end

	factory :logo do
		font_name "Helvetica"
		font_color "#000"
		font_size "12"
		alignment "Left"
	end

	factory :genre do
		name ""
	end

	factory :sub_genre do
		name ""
	end

	factory :email_provider do
		name ""
	end

	factory :blog_platform do
		name ""
	end

	factory :plan do
		name ""
	end

	factory :video do 
		sequence(:title) {|n| "Video#{n}"}
		url "http://www.youtube.com/watch?v=4vkqBfv8OMM"
		sequence(:order)
	end
end