class Api::NewsFeedController < ApplicationController
  
  respond_to :json
  
  
  def validate_email_key
    
    @band = Band.find(params[:id])
    api_key = @band.email_api_key
    lists = []
    
    if @band.email_provider.name == 'MailChimp'
      gb = Gibbon.new(api_key)
      if gb.lists
        puts 'email key is validated'
        mcList = gb.lists["data"]
        mcList.each do |list|
            lists << {:web_id => list['id'] , :name => list['name']}
        end
      end
    else      
      puts 'Constant Contact: email key is validated'
      # cc = ConstantContact::Connect.new('salmanaslam25', 'a123456', '30ec4a0c-2805-4549-b9b9-f2f009f3d596')
      # 30ec4a0c-2805-4549-b9b9-f2f009f3d596
      ConstantContact::Base.user = @band.email_api_username
      ConstantContact::Base.password = @band.email_api_password
      ConstantContact::Base.api_key =  api_key
      ccList = ConstantContact::List.find(:all)
      if ccList 
        ccList.each do |list|
         lists << {:web_id =>list.name , :name => list.name}
        end
      end
      
    end
    render :json => {:email_list => lists, :status => :ok}
    rescue 
      render :json => {:nothing => true, :status => :no}    
    
  end
  
  def email_list
   if user_signed_in?
      @band = current_user.band   
   else
      @band = Band.first    
   end
   api_key = @band.email_api_key
   lists =[]
   if @band.email_provider.name == 'MailChimp'
     gb = Gibbon.new(api_key)
     gb.lists["data"].each do |list| 
      lists << {:web_id => list['id'] , :name => list['name']}
     end
   else
     ConstantContact::Base.user = @band.email_api_username
     ConstantContact::Base.password = @band.email_api_password

     ConstantContact::Base.api_key = api_key
     ccList = ConstantContact::List.find(:all)
     ccList.each do |list|
      lists << {:web_id =>list.name , :name => list.name}
     end
     
   end     
    render :json => {:email_list => lists , :status => :ok}
   rescue 
    render :json => {:nothing => true, :status => :no}
  end
  
  def subscribe
   @band = Band.find(params[:id])
   if email = params[:email]
      api_key = @band.email_api_key
      list_id = @band.email_list
      
      puts @band.email_provider.name
     
      if @band.email_provider.name == 'MailChimp'
       puts 'subscribe to mail chimp' 
       gb = Gibbon.new(api_key)
       gb.listSubscribe({:id => list_id, 
            :email_address => email,
            :double_optin => false,
            :send_welcome => true})
      else
        puts 'subscribe to constant contact'
        ConstantContact::Base.user = @band.email_api_username
        ConstantContact::Base.password = @band.email_api_password
        ConstantContact::Base.api_key = api_key
        
        begin
          @contact = ConstantContact::Contact.new(:email_address => email)
          @contact.save
        rescue ActiveResource::ResourceConflict => e
          # contact already exists
          puts 'Contact already exists. Saving contact failed.'
          puts e
        end
        
      end        
      
  
      render :nothing => true, :status => :ok
   else
      render :nothing => true, :status => :bad_request
   end
   
  end
  
  
  def index
   
   if user_signed_in?
      @band = current_user.band   
   else
      @band = Band.first    
   end 
     
   uri = URI.parse("https://graph.facebook.com/#{@band.fb_handle}")
   http = Net::HTTP.new(uri.host, uri.port)
   http.use_ssl = true
   http.verify_mode = OpenSSL::SSL::VERIFY_NONE
   request  =  Net::HTTP::Get.new(uri.request_uri)
   response =  http.request(request)
   profile = JSON.parse response.body
    
   fb_url = "https://www.facebook.com/feeds/page.php?id=#{profile['id']}&format=rss20"
   blog_url = "#{@band.blog_url}/feeds/posts/default?alt=rss"
   tumblr_url  = "#{@band.blog_url}/rss"
   twitter_url = "http://twitter.com/statuses/user_timeline/#{@band.twitter_handle}.rss"   
   instagram_url = "http://statigr.am/feed/#{@band.instagram_handle.downcase}"   
   
   @entries = ''
   if params[:type] == 'blog'
    puts @band.blog_platform.name
    if @band.blog_platform.name == 'Blogger' 
      feeds = Feedzirra::Feed.fetch_and_parse(blog_url)
      @entries =  feeds.entries.zip(Array.new(feeds.entries.count, "blogger")) if(feeds)
            
    else  
      feeds = Feedzirra::Feed.fetch_and_parse(tumblr_url)
      @entries =  feeds.entries.zip(Array.new(feeds.entries.count, "tumblr")) if(feeds)
         
    end     
           
         
   elsif  params[:type] == 'instagram'       
    
    puts 'fetching instagram feeds'
    feeds = Feedzirra::Feed.fetch_and_parse(instagram_url)
    @entries =  feeds.entries.zip(Array.new(feeds.entries.count, "instagram"))   if(feeds)
     
   elsif  params[:type] == 'twitter'
    
    feeds = Feedzirra::Feed.fetch_and_parse(twitter_url)
    @entries =  feeds.entries.zip(Array.new(feeds.entries.count, "twitter"))   if(feeds)
    
        
   elsif  params[:type] == 'facebook'
    
    feeds = Feedzirra::Feed.fetch_and_parse(fb_url)
    @entries =  feeds.entries.zip(Array.new(feeds.entries.count, "facebook"))    if(feeds)
    
   else
    
    puts 'fetching all feeds'
    
    fb_feeds = Feedzirra::Feed.fetch_and_parse(fb_url)
    @entries = fb_feeds.entries.zip(Array.new(fb_feeds.entries.count, "facebook"))   if(fb_feeds)
    
    twitter_feeds = Feedzirra::Feed.fetch_and_parse(twitter_url)
    @entries = @entries + twitter_feeds.entries.zip(Array.new(twitter_feeds.entries.count, "twitter"))  if(twitter_feeds)
    
    instagram_feeds = Feedzirra::Feed.fetch_and_parse(instagram_url)
    @entries = @entries + instagram_feeds.entries.zip(Array.new(instagram_feeds.entries.count, "instagram"))  if(instagram_feeds)
    
    if @band.blog_platform.name == 'Blogger' 
     blog_feeds = Feedzirra::Feed.fetch_and_parse(blog_url)    
     @entries = @entries + blog_feeds.entries.zip(Array.new(blog_feeds.entries.count, "blogger"))   if(blog_feeds)
            
    else
      tumblr_feeds = Feedzirra::Feed.fetch_and_parse(tumblr_url)
      @entries =  @entries + tumblr_feeds.entries.zip(Array.new(tumblr_feeds.entries.count, "tumblr")) if(tumblr_feeds)
     
    end     
    
    
    
        
    @entries =  @entries.sort_by {|obj| obj[0].published}.reverse!
     
   end
    render :json => {:news_feed => @entries, :status => :ok}   
   rescue 
    render :json => {:nothing => true, :status => :no}
  end
  
end