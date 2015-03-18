require "spec_helper"

describe "/api/videos", :type => :api do

	def valid_attributes
		FactoryGirl.attributes_for(:video)
	end

	before do
		@band = FactoryGirl.create(:band)
	end

	describe "CREATE Video" do
    let(:url) {"/api/videos"}

		context "with valid attributes" do
	    
		  it "should be successful" do
		    post( "#{url}.json",
		     :video => valid_attributes.merge({:band_id => @band._id}) )

		    created_video = Video.where(:band_id => @band.id).last

		    route = "/api/videos/#{created_video.id}" 

		    last_response.status.should eql(201)
		    last_response.headers["Location"].should eql(route)
		    last_response.body.should eql(created_video.to_json)
		  end
	  end

	  context "with invalid attributes" do
	  	it "should not be successful" do
				post( "#{url}.json",
		     :video => valid_attributes)

		    last_response.status.should eql(422)

	  	end
	  end
  end

  describe "DELETE a Video" do
    
  	before do
  		@video = FactoryGirl.create(:video, :band_id => @band.id)
  	end

    let(:url) {"/api/videos/#{@video.id}"}

  	it "should be successful" do
  		delete "#{url}.json"

  		last_response.status.should == 204
  	end
  end

  describe "UPDATE a Video" do
    
  	before do
  		@video = FactoryGirl.create(:video, :band_id => @band.id)
  	end

    let(:url) {"/api/videos/#{@video.id}"}

  	it "should be successful" do
  		put "#{url}.json", :video => {
  			:font_name => "Times New Roman"}

  		last_response.status.should == 204
  		last_response.body.should eql("")

  		@video.reload
  		@video.font_name.should eql("Times New Roman")
  	end
  end

end