require "spec_helper"

describe "/api/live_shows", :type => :api do

	def valid_attributes
		FactoryGirl.attributes_for(:live_show)
	end

	before do
		@band = FactoryGirl.create(:band)
	end

	describe "CREATE Live Show" do
    let(:url) {"/api/live_shows"}

		context "with valid attributes" do

	    
		  it "should be successful" do
		    post( "#{url}.json",
		     :live_show => valid_attributes.merge({:band_id => @band._id}) )

		    created_show = LiveShow.where(:band_id => @band.id).last

		    route = "/api/live_shows/#{created_show.id}" 

		    last_response.status.should eql(201)
		    last_response.headers["Location"].should eql(route)
		    last_response.body.should eql(created_show.to_json)
		  end
	  end

	  context "with invalid attributes" do
	  	it "should not be successful" do
				post( "#{url}.json",
		     :live_show => valid_attributes)

		    last_response.status.should eql(422)

	  	end
	  end
  end

  describe "DELETE a Live Show" do
    
  	before do
  		@live_show = FactoryGirl.create(:live_show, :band_id => @band.id)
  	end

    let(:url) {"/api/live_shows/#{@live_show.id}"}

  	it "should be successful" do
  		delete "#{url}.json"

  		last_response.status.should == 204
  	end
  end

  describe "UPDATE a Live Show" do
    
  	before do
  		@live_show = FactoryGirl.create(:live_show, :band_id => @band.id)
  	end

    let(:url) {"/api/live_shows/#{@live_show.id}"}

  	it "should be successful" do
  		put "#{url}.json", :live_show => {
  			:venue => "New Venue"}

  		last_response.status.should == 204
  		last_response.body.should eql("")

  		@live_show.reload
  		@live_show.venue.should eql("New Venue")
  	end
  end

end